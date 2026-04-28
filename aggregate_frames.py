import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Config ────────────────────────────────────────────────────────────────────
INPUT   = "frames_classified_para_ML_enriched.csv"

# Labels that are not meaningful geographic/political categories
SPECIAL_LABELS = {"N/A", "European Bodies", "Other Institutional Speaker", "Rapporteur/Author"}

ALL_FRAMES = [
    "military_defence", "border_migration", "terrorism", "organised_crime",
    "cyber", "foreign_information_interference", "energy", "economic",
    "environmental", "health", "gender_based_violence", "food_security",
    "institutional_procedural",
]

# ── Load ──────────────────────────────────────────────────────────────────────
print("Loading enriched CSV...")
df = pd.read_csv(INPUT, encoding="utf-8-sig")
print(f"  {len(df):,} rows loaded")

# ── Helper: build wide top-frame table ───────────────────────────────────────
def build_topframe(data, group_col):
    """Count how many paragraphs have each frame as their top-1 frame, per group × year."""
    grp = (
        data.groupby([group_col, "year", "sector_frame_top1"])
        .size()
        .reset_index(name="count")
    )
    wide = grp.pivot_table(
        index=[group_col, "year"],
        columns="sector_frame_top1",
        values="count",
        fill_value=0,
    )
    wide.columns.name = None
    wide = wide.reset_index()

    # Ensure all frames present even if count = 0
    for f in ALL_FRAMES:
        if f not in wide.columns:
            wide[f] = 0

    # Total paragraphs per group-year
    totals = data.groupby([group_col, "year"]).size().reset_index(name="total_paragraphs")
    wide = wide.merge(totals, on=[group_col, "year"])

    # Percentage columns
    frame_cols = [f for f in ALL_FRAMES if f in wide.columns]
    for f in frame_cols:
        wide[f"pct_{f}"] = (wide[f] / wide["total_paragraphs"] * 100).round(2)

    # Reorder: group, year, total, counts, percentages
    count_cols = frame_cols
    pct_cols   = [f"pct_{f}" for f in frame_cols]
    wide = wide[[group_col, "year", "total_paragraphs"] + count_cols + pct_cols]
    wide = wide.sort_values([group_col, "year"]).reset_index(drop=True)
    return wide


# ── Helper: build wide multi-frame table ─────────────────────────────────────
def build_multiframe(data, group_col):
    """
    Count how many paragraphs mention each frame in sector_frames_multi
    (i.e. scored > 0.4), per group × year.
    A single paragraph can contribute to multiple frames.
    """
    # Total paragraphs per group-year (denominator)
    totals = data.groupby([group_col, "year"]).size().reset_index(name="total_paragraphs")

    # Parse and explode sector_frames_multi
    d = data.copy()
    d["frame"] = d["sector_frames_multi"].apply(
        lambda x: [f.strip() for f in str(x).split(",") if f.strip() and f.strip() != "nan"]
        if pd.notna(x) else []
    )
    d_exp = d.explode("frame")
    d_exp = d_exp[d_exp["frame"].isin(ALL_FRAMES)]

    grp = (
        d_exp.groupby([group_col, "year", "frame"])
        .size()
        .reset_index(name="count")
    )
    wide = grp.pivot_table(
        index=[group_col, "year"],
        columns="frame",
        values="count",
        fill_value=0,
    )
    wide.columns.name = None
    wide = wide.reset_index()

    for f in ALL_FRAMES:
        if f not in wide.columns:
            wide[f] = 0

    wide = wide.merge(totals, on=[group_col, "year"])

    frame_cols = [f for f in ALL_FRAMES if f in wide.columns]
    for f in frame_cols:
        wide[f"pct_{f}"] = (wide[f] / wide["total_paragraphs"] * 100).round(2)

    count_cols = frame_cols
    pct_cols   = [f"pct_{f}" for f in frame_cols]
    wide = wide[[group_col, "year", "total_paragraphs"] + count_cols + pct_cols]
    wide = wide.sort_values([group_col, "year"]).reset_index(drop=True)
    return wide


# ── Filter subsets ────────────────────────────────────────────────────────────
# Exclude non-security paragraphs from both numerator and denominator.
# not_security paragraphs passed the speech-level filter but were classified
# as not security-relevant at paragraph level — they are excluded entirely.
df_sec = df[df["sector_frame_top1"] != "not_security"].copy()

df_country = df_sec[~df_sec["country"].isin(SPECIAL_LABELS)].copy()
df_orient  = df_sec[~df_sec["political_orientation"].isin(SPECIAL_LABELS)].copy()

not_sec_total = (df["sector_frame_top1"] == "not_security").sum()
print(f"\nExcluded not_security paragraphs: {not_sec_total:,} ({not_sec_total/len(df)*100:.1f}% of all rows)")
print(f"Country subset:      {len(df_country):,} rows, {df_country['country'].nunique()} countries")
print(f"Orientation subset:  {len(df_orient):,} rows, {df_orient['political_orientation'].nunique()} orientations")

# ── Build tables ──────────────────────────────────────────────────────────────
print("\nBuilding aggregations...")

country_top   = build_topframe(df_country,  "country")
country_multi = build_multiframe(df_country, "country")
orient_top    = build_topframe(df_orient,   "political_orientation")
orient_multi  = build_multiframe(df_orient, "political_orientation")

# ── Save ──────────────────────────────────────────────────────────────────────
outputs = {
    "aggregated_country_year_topframe.xlsx":     country_top,
    "aggregated_country_year_multiframe.xlsx":   country_multi,
    "aggregated_orientation_year_topframe.xlsx": orient_top,
    "aggregated_orientation_year_multiframe.xlsx": orient_multi,
}

for fname, table in outputs.items():
    table.to_excel(fname, index=False, engine="openpyxl")
    print(f"  Saved {fname}  ({len(table):,} rows × {len(table.columns)} columns)")

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n=== Summary ===")
print(f"Country × year combinations (top-frame):   {len(country_top):,}")
print(f"Country × year combinations (multi-frame): {len(country_multi):,}")
print(f"Orientation × year combinations (top):     {len(orient_top):,}")
print(f"Orientation × year combinations (multi):   {len(orient_multi):,}")

print("\nTop frame distribution (all countries, all years):")
print(df_country["sector_frame_top1"].value_counts().to_string())

print("\nDone.")
