# EP Security Debates — Computational Text Analysis

A computational analysis of security debates in the **European Parliament** over
time, combining web scraping, NLP classification, and interactive data
visualisation to trace how the framing of security has evolved and how it differs
across member states, political groups, and legislative periods.

![MEPs debating security in the European Parliament](assets/ep_debate.png)

---

## Research motivation

This project grows out of a shared interest in the **political economy of
security in the European Union** — and in particular, the contested nature of
what "security" means inside Europe's core deliberative institution.

Security has never been a stable concept in EU politics. From Cold War anxieties
to the post-9/11 expansion of internal security regimes, from migration debates
recast as border threats to the post-2022 resurgence of hard defence on the
agenda, the EP's plenary debates offer a longitudinal record of how security
frames emerge, compete, and shift. Yet despite the richness of this archive,
large-scale quantitative work on EP security discourse remains scarce.

This project addresses that gap. By scraping the full text of EP plenary
interventions and applying a sequence of increasingly precise NLP methods —
from broad topic models to targeted LLM annotation — we aim to answer three
connected questions:

1. **How has the *content* of EP security debates changed across legislative
   periods?** Do certain threat framings (military, cyber, migration, climate,
   health) rise and fall together, or do they follow independent trajectories?
2. **Do national delegations and political groups frame security differently?**
   Is there a measurable left–right or North–South divide in how MEPs invoke
   security language?
3. **What drives rhetorical escalation?** Are spikes in security language
   associated with specific geopolitical events, legislative cycles, or electoral
   pressures — and does the pattern differ across groups?

The analytical pipeline follows the same logic as our prior work on earnings-call
discourse: start broad (topic models), narrow to the phenomenon of interest
(security-framing detection), characterise tone (sentiment), and finally extract
structured meaning (LLM annotation). The project culminates in an interactive
website where users can explore the results and download the underlying data.

---

## Pipeline overview

```
01_scrape_debates.py              (Python / Scrapy or Playwright)
        ↓
   data/raw/debates_raw.jsonl
        ↓
02_prepare_corpus.py              (Python / pandas, spaCy)
        ↓
   data/corpus_speeches.csv
   data/corpus_metadata.csv
        ↓
03_topic_modeling.ipynb           (Python / gensim LDA or BERTopic)
        ↓
   data/doc_topic_distributions.csv
   data/topic_terms.csv
        ↓
04_visualize_topics.R             (R / ggplot2)
        ↓
   figures/topic_*
        ↓
05_security_detection.ipynb       (Python / regex + zero-shot classifier)
        ↓
   data/security_flagged.csv
        ↓
06_sentiment_inference.py         (Python / HuggingFace; EU-politics fine-tuned BERT)
        ↓
   data/sentiment_scores.csv
        ↓
07_llm_annotation.py              (Python / Anthropic API)
        ↓
   data/security_context.json
        ↓
08_results_viz.ipynb              (Python / matplotlib, seaborn)
        ↓
   figures/llm_*
        ↓
09_website/                       (React / D3.js interactive explorer)
```

---

## Analysis steps

### Step 1 — Scraping EP plenary debates (`01_scrape_debates.py`)

The European Parliament publishes verbatim records of all plenary debates at
[europarl.europa.eu](https://www.europarl.europa.eu/plenary/en/debates-video.html).
The scraper collects full speech texts alongside structured metadata: speaker
name, national delegation, EP political group, date, legislative period, and
agenda item. The target corpus covers all available plenary debates from the
4th EP (1994–1999) through the 10th EP (2024–present), yielding approximately
500,000 individual speech turns.

### Step 2 — Corpus preparation (`02_prepare_corpus.py`)

Raw JSON is cleaned, deduplicated, and exported to two analysis-ready tables:
`corpus_speeches.csv` (one row per speech turn with full text and metadata) and
`corpus_metadata.csv` (one row per debate sitting). Language detection flags
the small share of non-English interventions for optional exclusion.

### Step 3 — Topic modelling (`03_topic_modeling.ipynb`)

With no prior assumptions about what "security" encompasses, an LDA or BERTopic
model maps the latent topical structure of the full corpus. This surfaces the
main axes of EP debate beyond security — trade, environment, social policy,
enlargement — and provides the baseline against which security-related topics
can be identified and their relative salience tracked over time.

### Step 4 — Security detection (`05_security_detection.ipynb`)

A multi-category keyword search flags speeches where security language appears
at the sentence level. Four framing categories are distinguished:

| Category | Core terms |
|---|---|
| **Military / defence** | NATO, defence, military, armed forces, deterrence |
| **Internal / border security** | border, Frontex, Europol, terrorism, surveillance |
| **Cyber security** | cyber, digital infrastructure, data protection, disinformation |
| **Societal / human security** | climate security, food security, health security, energy security |

Sentence-level co-occurrence with a risk or threat term is required to reduce
false positives.

### Step 5 — Sentiment (`06_sentiment_inference.py`)

A BERT-based sentiment model fine-tuned on political text scores each
security-flagged speech for tone. This reveals whether certain framing
categories (e.g., migration-as-security) are systematically more alarmist, and
whether left and right groups differ in the emotional register they adopt when
invoking security.

### Step 6 — LLM annotation (`07_llm_annotation.py`)

For each flagged speech, a large language model (`claude-haiku-4-5-20251001`)
answers a structured set of classification questions, transforming raw text into
interpretable variables:

| Field | Question |
|---|---|
| `framing_type` | Which security frame dominates — military, internal, cyber, or societal? |
| `threat_actor` | Is a specific external or internal threat actor named? |
| `eu_vs_national` | Is security framed as an EU-level or member-state responsibility? |
| `urgency` | Is the language urgent/alarmist or measured/procedural? |
| `legislative_link` | Is the speech tied to a specific legislative proposal or vote? |
| `cross_frame` | Does the speech deliberately link two or more security frames? |

### Step 7 — Interactive website (`09_website/`)

A React + D3.js application lets users explore the annotated corpus without
writing code. Features include:

- **Timeline view** — security-frame salience over legislative periods, with
  breakdowns by political group and national delegation
- **Heatmap explorer** — framing type × political group × period, filterable
  by country, party family, and keyword
- **Speech browser** — full-text search across flagged speeches with metadata
  filters and LLM annotation overlays
- **Data download** — CSV export of any filtered view for independent analysis

---

## Project structure

```
.
├── 01_scrape_debates.py           # Scraper: EP plenary debates → raw JSONL
├── 02_prepare_corpus.py           # Corpus assembly and metadata normalisation
├── 03_topic_modeling.ipynb        # LDA / BERTopic topic modelling
├── 04_visualize_topics.R          # ggplot2 topic visualisations
├── 05_security_detection.ipynb    # Sentence-level security frame detection
├── 06_sentiment_inference.py      # BERT sentiment batch inference
├── 07_llm_annotation.py           # LLM structured annotation (Anthropic API)
├── 08_results_viz.ipynb           # Final result visualisations
├── 09_website/                    # React + D3.js interactive explorer
│   ├── src/
│   ├── public/
│   └── package.json
├── assets/
│   └── ep_debate.png              # Project header image
├── data/
│   ├── raw/                       # Raw scraped data (not versioned)
│   ├── corpus_speeches.csv        # One row per speech turn
│   ├── corpus_metadata.csv        # One row per debate sitting
│   ├── doc_topic_distributions.csv
│   ├── topic_terms.csv
│   ├── security_flagged.csv       # Speeches flagged by security detector
│   ├── sentiment_scores.csv       # BERT sentiment scores
│   └── security_context.json     # LLM annotation results
└── figures/                       # All PNG outputs
```

Files generated at runtime (excluded from version control):
```
data/raw/                          # regenerate with 01_scrape_debates.py
data/corpus_speeches.csv           # regenerate with 02_prepare_corpus.py
data/corpus_metadata.csv           # regenerate with 02_prepare_corpus.py
```

---

## Output figures

| File | Description |
|---|---|
| `figures/topic_overview.png` | Topic salience by legislative period |
| `figures/topic_heatmap.png` | Topic × period heatmap |
| `figures/topic_by_group.png` | Topic footprints by EP political group |
| `figures/security_frames_over_time.png` | Security frame salience by year and legislative period |
| `figures/security_by_group.png` | Frame prevalence by political group |
| `figures/security_by_country.png` | Frame prevalence by national delegation (top 20) |
| `figures/sentiment_by_frame.png` | Net sentiment by security framing category |
| `figures/sentiment_by_group.png` | Net sentiment by political group |
| `figures/llm_framing_distribution.png` | LLM-classified frame type distribution |
| `figures/llm_eu_vs_national.png` | EU-level vs. national responsibility framing over time |
| `figures/llm_urgency_by_group.png` | Urgency scores by political group |
| `figures/llm_cross_frame_heatmap.png` | Cross-frame linkage patterns |

---

## Environment

**Python** (3.10+, in a dedicated `.venv`):
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**R** (for ggplot2 visualisations):
Required packages: `dplyr`, `tidyr`, `readr`, `lubridate`, `ggplot2`,
`forcats`, `stringr`, `scales`, `patchwork`

**API keys:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # for 07_llm_annotation.py
```

`07_llm_annotation.py` writes a rolling checkpoint every 50 speeches so long
runs can be safely interrupted and resumed with `--resume`.

---

## Collaboration

This project is developed collaboratively. The repository follows a
feature-branch workflow — please open a pull request for all non-trivial changes.

| Contributor | GitHub |
|---|---|
| Niklas Jütting | [@juttingn](https://github.com/juttingn) |
| Victoria Koch | [@victoriackoch](https://github.com/victoriackoch) |
| Natalia F. | [@nataliaf01](https://github.com/nataliaf01) |

---

## Status

> **Work in progress.** The README describes the intended pipeline; scripts will
> be added incrementally as the project develops. This file will be updated as
> each component reaches a stable state.
