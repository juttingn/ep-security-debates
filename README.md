# EP Security Debates — Computational Text Analysis

A computational analysis of security debates in the **European Parliament**,
combining web scraping, NLP classification, and interactive data visualisation
to trace how the framing of security has evolved across EP9–10 (2019–2026)
and how it differs across member states and political orientations.

![MEPs debating security in the European Parliament](assets/ep_debate.jpg)

---

## Research motivation

This project grows out of a shared interest in the **political economy of
security in the European Union** — and in particular, the contested nature of
what "security" means inside Europe's core deliberative institution.

Security has never been a stable concept in EU politics. From migration debates
recast as border threats to the post-2022 resurgence of hard defence, the EP's
plenary debates offer a longitudinal record of how security frames emerge,
compete, and shift across a period of extraordinary geopolitical turbulence.
Yet despite the richness of this archive, large-scale quantitative work on EP
security discourse remains scarce.

This project addresses that gap. By scraping EP plenary interventions and
applying a sequence of NLP methods — from inductive topic models to zero-shot
NLI classification — we answer three connected questions:

1. **How has the *content* of EP security debates changed across EP9–10?**
   Do certain threat framings (military, energy, migration, cyber, health)
   rise and fall together, or do they follow independent trajectories?
2. **Do national delegations and political orientations frame security differently?**
   Is there a measurable left–right or North–South divide in how MEPs invoke
   security language?
3. **How robust is the classification?** Do results hold when speeches are
   translated to English or when the granularity shifts from paragraphs to
   context windows?

---

## Pipeline overview

```
01_scrape_debates.R               (R / rvest + Scrapy)
        ↓
   data/raw/debates_raw.jsonl
        ↓
02_prepare_corpus.py              (Python / pandas, langdetect)
        ↓
   data/corpus_speeches.csv
   data/corpus_metadata.csv
        ↓
03_topic_modeling.ipynb           (Python / BERTopic)
        ↓
   data/topic_assignments.csv
   data/topic_terms.csv
        ↓
04_security_detection.ipynb       (Python / mDeBERTa-v3-mnli-xnli, zero-shot NLI)
        ↓
   data/frames_classified_para_ML_enriched.csv
        ↓
05_robustness_checks.ipynb        (Python / correlation analysis)
        ↓
   data/robustness_full_table.csv
        ↓
09_website/                       (React + Recharts interactive explorer)
```

---

## Analysis steps

### Step 1 — Scraping EP plenary debates

The European Parliament publishes verbatim records of all plenary debates at
[europarl.europa.eu](https://www.europarl.europa.eu/plenary/en/debates-video.html).
The scraper collects full speech texts alongside structured metadata: speaker
name, national delegation, EP political group, date, legislative period, and
agenda item. The corpus covers EP9 (July 2019–June 2024) and EP10 (July
2024–early 2026). Speeches are pre-filtered for security-relevant keywords
before paragraph segmentation.

### Step 2 — Corpus preparation

Raw data is cleaned, deduplicated, and exported to analysis-ready tables.
Language detection identifies the ~8% of non-English interventions. Speaker
role and political group are normalised across EP9 and EP10 (accounting for
group renames, e.g. ID → PfE). The unit of analysis is the **paragraph**
(blank-line delimited, minimum 450 characters; shorter units are merged with
the next).

### Step 3 — Topic modelling (BERTopic)

With no prior assumptions about what "security" encompasses, BERTopic maps the
latent topical structure of security-filtered speeches using sentence-transformer
embeddings → UMAP → HDBSCAN. Two variants were run: (a) multilingual (source
language), (b) English-translated. The multilingual variant is the main
specification. 53 coherent topics were identified; Topic -1 (outlier noise)
and Topic 16 (Maltese-dominated, distorts ML model) were excluded.

The clusters were used **inductively** to validate and expand the set of security
frames from the literature — not for hypothesis testing. Key frame additions:
Organised Crime (Topic 43), Gender-Based Violence (Topics 3 & 12), Food Security
(Topic 7), Foreign Information Interference (Topics 26 & 48), and the separation
of Energy from broad Economic security (Topics 9 & 17).

### Step 4 — Security frame classification (NLI)

Paragraph-level zero-shot classification using
[`mDeBERTa-v3-mnli-xnli`](https://huggingface.co/MoritzLaurer/mDeBERTa-v3-base-mnli-xnli)
— a single multilingual NLI checkpoint covering all 24 EU languages, enabling
classification on source-language text without prior translation.

**13 security frames** (derived from Buzan et al. 1998 and validated against EU
security communication):

| Frame | Description |
|---|---|
| Military Defence | Armed forces, NATO, war, military aggression |
| Border / Migration | Migration as border threat, asylum restrictions |
| Terrorism | Terrorist attacks, extremist violence |
| Organised Crime | Cross-border crime, trafficking, money laundering |
| Cyber Security | Cyber attacks, digital infrastructure threats |
| Foreign Info. Interference | Disinformation, election interference |
| Energy Security | Supply disruptions, dependency on foreign energy |
| Economic Security | Coercion, sanctions, supply-chain vulnerabilities |
| Environmental Security | Climate change as driver of instability |
| Health Security | Pandemics, biological threats |
| Gender-Based Violence | Sexual violence, femicide in security contexts |
| Food Security | Grain blockades, food supply disruptions |
| Institutional / Procedural | Reference/non-security category |

**Multi-label** (confidence threshold = 0.4): a paragraph can carry multiple
frames simultaneously. Top-1 frame assigns each paragraph to its dominant frame
for summary statistics. 78,041 paragraphs classified; 37,201 receive at least
one security label above threshold.

### Step 5 — Robustness checks

Two independent identification checks verify that the main specification
(multilingual, paragraph-level) is not sensitive to arbitrary methodological
choices:

| Check | Comparison | Finding |
|---|---|---|
| **Translation** | ML specification vs. EN-translated speeches | Multi-label correlations ≥0.72 for 11 of 13 frames; terrorism and economic show lower top-1 stability |
| **Granularity** | Paragraph vs. 5-sentence context window | Highly robust (≥0.85) for 10 of 13 frames |

The multi-label paragraph specification is the preferred and reported
specification. See the Security Frames page on the website for full
correlation tables.

### Step 6 — Interactive website (`09_website/`)

A React + Recharts application lets users explore the annotated corpus:

- **Security Frames** — stacked bar (top-1) and line chart (multi-label) of
  frame distribution by year, three-phases narrative, frame definitions,
  robustness tables and scatter plots
- **Corpus** — paragraph counts by year, country, and political orientation
- **Topics** — word cloud and table of 53 BERTopic clusters with linked frames
- **Explorer** — country and orientation frame profiles (bar chart + radar)

---

## Project structure

```
.
├── EP_Security_Debates_Scraper.R              # Scraper: EP plenary debates
├── security_framing_classification_pipeline.ipynb  # NLI classification
├── 09_website/                                # React interactive explorer
│   ├── src/
│   │   ├── data/placeholder.js               # All analysis data (real)
│   │   ├── pages/                            # One component per analysis step
│   │   └── components/
│   └── package.json
├── assets/
│   └── ep_debate.jpg                         # Project header image
└── README.md
```

---

## Environment

**Python** (3.10+):
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Key packages: `transformers`, `bertopic`, `sentence-transformers`, `pandas`,
`scikit-learn`, `openpyxl`

**R** (for scraping):
Required packages: `rvest`, `dplyr`, `tidyr`, `readr`, `stringr`

**Website** (Node.js 18+):
```bash
cd 09_website
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

---

## Collaboration

| Contributor | GitHub |
|---|---|
| Niklas Jütting | [@juttingn](https://github.com/juttingn) |
| Victoria Koch | [@victoriackoch](https://github.com/victoriackoch) |
| Natalia F. | [@nataliaf01](https://github.com/nataliaf01) |
| Michal K. | [@michalkolb01](https://github.com/michalkolb01) |

---

## Status

EP9–10 classification pipeline complete. Website live at
[juttingn.github.io/ep-security-debates](https://juttingn.github.io/ep-security-debates/).
