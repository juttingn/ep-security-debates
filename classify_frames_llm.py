"""
LLM-based classification of EP security debate paragraphs using the Claude API.
Classifies each paragraph on three dimensions:

  Q1 — Threat actor type:
       External state actor | External non-state actor | Internal actor | No specific actor

  Q2 — Security responsibility framing:
       EU level | Member-state level | Shared | Not specified

  Q3 — Tone:
       Urgent/Alarmist | Concerned/Assertive | Measured/Deliberative

Usage:
  1. Set your API key:  export ANTHROPIC_API_KEY=sk-ant-...
  2. Run demo mode (20 paragraphs):  python classify_frames_llm.py
  3. Run full corpus (2023-2025):    python classify_frames_llm.py --full

Cost estimate (Claude Haiku 4.5, ~37k paragraphs, 2 questions combined):
  ~$8-12 with prompt caching enabled.
"""

import os
import sys
import json
import argparse
import time
import pandas as pd
import anthropic

# ── Config ────────────────────────────────────────────────────────────────────
INPUT_CSV   = "frames_classified_para_ML_enriched.csv"
OUTPUT_CSV  = "frames_classified_llm.csv"
OUTPUT_XLSX = "frames_classified_llm.xlsx"
CHECKPOINT  = "frames_classified_llm_checkpoint.json"

MODEL       = "claude-haiku-4-5"
YEARS       = [2023, 2024, 2025]
DEMO_N      = 20        # rows to classify in demo mode
SLEEP_S     = 0.3       # pause between calls (rate-limit buffer)

# ── System prompt (cached — identical for every call) ─────────────────────────
SYSTEM_PROMPT = """You are an expert analyst of European Parliament security debates.
For each paragraph provided, classify it on exactly three dimensions.

Return ONLY a valid JSON object with these keys and allowed values:

{
  "threat_actor": one of ["External state actor", "External non-state actor", "Internal actor", "No specific actor"],
  "responsibility": one of ["EU level", "Member-state level", "Shared", "Not specified"],
  "tone": one of ["Urgent/Alarmist", "Concerned/Assertive", "Measured/Deliberative"]
}

Definitions:

threat_actor:
  - "External state actor": a named or clearly implied foreign government or state (e.g. Russia, China, Iran)
  - "External non-state actor": a named or implied non-state group outside the EU (terrorist networks, criminal organisations, hackers)
  - "Internal actor": a named or implied actor within the EU or member states (domestic extremism, a specific member state, corruption)
  - "No specific actor": threat is vague, structural, or no actor is identified

responsibility:
  - "EU level": text argues or implies the EU / EU institutions should act or are responsible
  - "Member-state level": text argues or implies national governments / member states should act or are responsible
  - "Shared": both EU and member-state responsibility explicitly mentioned
  - "Not specified": no clear normative framing of who should act

tone:
  - "Urgent/Alarmist": crisis language, immediate threat, calls for emergency or urgent action
  - "Concerned/Assertive": serious and firm stance but not alarmist; clear political position
  - "Measured/Deliberative": analytical, policy-focused, procedural, balanced

Do not explain your reasoning. Return only the JSON object."""


# ── Classification function ───────────────────────────────────────────────────
def classify_paragraph(client: anthropic.Anthropic, text: str) -> dict:
    """Send one paragraph to the API and return parsed classification dict."""
    response = client.messages.create(
        model=MODEL,
        max_tokens=128,
        system=[{
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"},   # cached across all calls
        }],
        messages=[{
            "role": "user",
            "content": f"Classify this paragraph:\n\n{text}"
        }],
    )

    raw = next(b.text for b in response.content if b.type == "text")

    # Parse JSON — strip any markdown fences if present
    raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    result = json.loads(raw)

    # Attach token usage for cost tracking
    result["_input_tokens"]       = response.usage.input_tokens
    result["_output_tokens"]      = response.usage.output_tokens
    result["_cache_read_tokens"]  = getattr(response.usage, "cache_read_input_tokens", 0)
    result["_cache_write_tokens"] = getattr(response.usage, "cache_creation_input_tokens", 0)

    return result


# ── Cost estimation helper ────────────────────────────────────────────────────
def estimate_cost(total_input, total_output, cache_read, cache_write):
    """Estimate USD cost at Haiku 4.5 pricing."""
    # Haiku 4.5: $1.00/MTok input, $5.00/MTok output
    # Cache read: ~$0.10/MTok, Cache write: ~$1.25/MTok (5-min TTL)
    uncached_input = total_input - cache_read
    cost  = uncached_input  / 1_000_000 * 1.00
    cost += cache_read      / 1_000_000 * 0.10
    cost += cache_write     / 1_000_000 * 1.25
    cost += total_output    / 1_000_000 * 5.00
    return cost


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--full", action="store_true",
                        help="Run on full 2023-2025 corpus (not just demo rows)")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ERROR: Set ANTHROPIC_API_KEY environment variable first.")

    client = anthropic.Anthropic(api_key=api_key)

    # ── Load and filter data ──────────────────────────────────────────────────
    print("Loading enriched CSV...")
    df = pd.read_csv(INPUT_CSV, encoding="utf-8-sig")

    # Security paragraphs only, last 3 years
    df = df[
        (df["sector_frame_top1"] != "not_security") &
        (df["year"].isin(YEARS))
    ].copy()

    if not args.full:
        df = df.head(DEMO_N)
        print(f"DEMO MODE — classifying first {DEMO_N} rows only.")
    else:
        print(f"FULL MODE — {len(df):,} paragraphs (2023-2025, security only).")

    # ── Load checkpoint (resume-safe) ─────────────────────────────────────────
    done = {}
    if os.path.exists(CHECKPOINT):
        with open(CHECKPOINT, encoding="utf-8") as f:
            done = json.load(f)
        print(f"Resuming — {len(done):,} rows already classified.")

    # ── Classify ──────────────────────────────────────────────────────────────
    results = []
    total_in = total_out = cache_r = cache_w = 0
    errors   = 0

    for i, (idx, row) in enumerate(df.iterrows(), 1):
        row_id = str(idx)

        if row_id in done:
            results.append(done[row_id])
            continue

        text = str(row.get("text", "")).strip()
        if not text:
            result = {
                "threat_actor": "No specific actor",
                "responsibility": "Not specified",
                "tone": "Measured/Deliberative",
                "_input_tokens": 0, "_output_tokens": 0,
                "_cache_read_tokens": 0, "_cache_write_tokens": 0,
            }
        else:
            try:
                result = classify_paragraph(client, text)
            except Exception as e:
                print(f"  [row {idx}] ERROR: {e}")
                result = {
                    "threat_actor": "ERROR",
                    "responsibility": "ERROR",
                    "tone": "ERROR",
                    "_input_tokens": 0, "_output_tokens": 0,
                    "_cache_read_tokens": 0, "_cache_write_tokens": 0,
                }
                errors += 1

        result["_row_idx"] = idx
        results.append(result)
        done[row_id] = result

        # Accumulate token counts
        total_in += result["_input_tokens"]
        total_out += result["_output_tokens"]
        cache_r  += result["_cache_read_tokens"]
        cache_w  += result["_cache_write_tokens"]

        # Progress
        if i % 10 == 0 or i == len(df):
            cost = estimate_cost(total_in, total_out, cache_r, cache_w)
            print(f"  [{i}/{len(df)}] cost so far: ${cost:.4f}  "
                  f"(cache hit: {cache_r:,} tokens)")

        # Checkpoint every 50 rows
        if i % 50 == 0:
            with open(CHECKPOINT, "w", encoding="utf-8") as f:
                json.dump(done, f, ensure_ascii=False)

        time.sleep(SLEEP_S)

    # Final checkpoint
    with open(CHECKPOINT, "w", encoding="utf-8") as f:
        json.dump(done, f, ensure_ascii=False)

    # ── Merge results back onto the dataframe ─────────────────────────────────
    results_df = pd.DataFrame(results)
    results_df["_row_idx"] = results_df["_row_idx"].astype(df.index.dtype)
    results_df = results_df.set_index("_row_idx")

    df["threat_actor"]   = results_df["threat_actor"]
    df["responsibility"] = results_df["responsibility"]
    df["tone"]           = results_df["tone"]

    # Drop internal token columns from output
    out_cols = [c for c in df.columns if not c.startswith("_")]
    df = df[out_cols]

    # ── Save outputs ──────────────────────────────────────────────────────────
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
    df.to_excel(OUTPUT_XLSX, index=False, engine="openpyxl")
    print(f"\nSaved: {OUTPUT_CSV}  ({len(df):,} rows)")
    print(f"Saved: {OUTPUT_XLSX}")

    # ── Final cost summary ────────────────────────────────────────────────────
    final_cost = estimate_cost(total_in, total_out, cache_r, cache_w)
    cache_pct  = (cache_r / total_in * 100) if total_in else 0
    print(f"\n=== Cost Summary ===")
    print(f"Total input tokens:   {total_in:,}  (cache hit: {cache_r:,} = {cache_pct:.1f}%)")
    print(f"Total output tokens:  {total_out:,}")
    print(f"Estimated total cost: ${final_cost:.4f}")
    if errors:
        print(f"Rows with errors:     {errors}")
    print("\nDone.")


if __name__ == "__main__":
    main()
