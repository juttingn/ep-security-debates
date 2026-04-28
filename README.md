# EP Security Debates — Computational Text Analysis

A computational analysis of security debates in the **European Parliament**,
combining web scraping, NLP classification, and interactive data visualisation
to trace how the framing of security has evolved across EP9–10 (2019–2026)
and how it differs across member states and political orientations.

**Live website:** [juttingn.github.io/ep-security-debates](https://juttingn.github.io/ep-security-debates/)

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

This project addresses that gap by scraping EP plenary interventions and
applying a sequence of NLP methods — from inductive topic models to zero-shot
NLI classification — to answer three connected questions:

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

## Key findings

- **Economic security dominates**: ~43–46% of all top-1 frame assignments, stable across all years, driven by sanctions, trade coercion and supply-chain vulnerabilities.
- **Military framing surges post-2022**: rises from ~13% (2021) to ~19% (2025) following Russia's full-scale invasion of Ukraine — the largest single-frame shift in the 2019–2026 window.
- **Energy security nearly doubles from 2022**: jumps from ~8% (pre-2022) to ~15% (2026), reflecting sustained discourse on gas dependency and the post-invasion energy crisis.
- **Health security follows a classic securitisation arc**: peaks at 5–6% in 2020–21, falls below 1% as COVID recedes.

Corpus: **37,201 security-labelled paragraphs** across **28 national delegations**, 2019–2026.

---

## Pipeline overview

The classification scripts live on [Google Drive](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko) — see [`README_classification_pipeline.md`](README_classification_pipeline.md) for the full file layout. The five stages are:

```
EP_Security_Debates_Scraper (22April).R     ← scrape EP plenary records  [in repo]
        ↓
   corpus_ep_security_CLEAN.xlsx
        ↓
00_translate.py                              ← optional EN translation for robustness  [Google Drive]
01_segment_units.py                          ← paragraph / sentence / context-window segmentation  [Google Drive]
        ↓
02a_bertopic_english.py                      ← BERTopic (EN)  [Google Drive]
02b_bertopic_multilingual.py                 ← BERTopic (ML) ← main topic model  [Google Drive]
        ↓
03_classify_frames_zeroshot.py               ← mDeBERTa-v3 zero-shot NLI, 13 frames  [Google Drive]
        ↓
   frames_classified_para_ML_enriched.csv
        ↓
04_robustness_checks.py                      ← translation + granularity correlation checks  [Google Drive]
        ↓
09_website/                                  ← React + Recharts interactive explorer  [in repo]
```

---

## Analysis steps

### Step 1 — Scraping EP plenary debates

The European Parliament publishes verbatim records of all plenary debates at
[europarl.europa.eu](https://www.europarl.europa.eu/plenary/en/debates-video.html).
The scraper ([`EP_Security_Debates_Scraper (22April).R`](EP_Security_Debates_Scraper%20(22April).R)) collects full speech
texts alongside structured metadata: speaker name, national delegation, EP
political group, date, legislative period, and agenda item. The corpus covers
EP9 (July 2019–June 2024) and EP10 (July 2024–early 2026).

19,859 speeches segmented into 78,041 paragraphs (avg 3.9 per speech).
Speeches are pre-filtered for security-relevant keywords before paragraph
segmentation.

### Step 2 — Corpus preparation & translation

Raw data is cleaned, deduplicated, and exported. Language detection identifies
non-English interventions. Speaker role and political group are normalised
across EP9 and EP10 (accounting for group renames, e.g. ID → PfE). The unit
of analysis is the **paragraph** (blank-line delimited, minimum 450 characters;
shorter units are merged with the next).

An optional translation step (`00_translate.py`, Google Drive) produces an English version of
all speeches for the translation robustness check.

### Step 3 — Topic modelling (BERTopic)

With no prior assumptions about what "security" encompasses, BERTopic maps the
latent topical structure of security-filtered speeches using sentence-transformer
embeddings → UMAP → HDBSCAN. Two variants were run: (a) multilingual (`02b_bertopic_multilingual.py`,
source language), (b) English-translated (`02a_bertopic_english.py`). The multilingual variant is
the main specification. 53 coherent topics were identified; Topic -1 (outlier
noise) and Topic 16 (Maltese-dominated, distorts ML model) were excluded.

The clusters were used **inductively** to validate and expand the set of security
frames from the literature. Key frame additions confirmed by topic analysis:
Organised Crime (Topic 43), Gender-Based Violence (Topics 3 & 12), Food Security
(Topic 7), Foreign Information Interference (Topics 26 & 48), and the separation
of Energy from broad Economic security (Topics 9 & 17).

### Step 4 — Security frame classification (NLI)

Paragraph-level zero-shot classification using
[`mDeBERTa-v3-mnli-xnli`](https://huggingface.co/MoritzLaurer/mDeBERTa-v3-base-mnli-xnli)
— a single multilingual NLI checkpoint covering all 24 EU languages, enabling
classification on source-language text without translation.

**13 security frames** (derived from Buzan et al. 1998 and validated against
BERTopic clusters and EU security communication):

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
| Institutional / Procedural | Reference / non-security category |

**Multi-label** (confidence threshold = 0.4): a paragraph can carry multiple
frames simultaneously. 68% of paragraphs receive 2 or more frames above
threshold. Top-1 frame assigns each paragraph to its highest-scoring frame
for summary statistics.

### Step 5 — Robustness checks

Two independent specification checks verify that the main specification
(multilingual, paragraph-level) is not sensitive to arbitrary methodological
choices:

| Check | Comparison | Finding |
|---|---|---|
| **Translation** | ML specification vs. EN-translated speeches | Multi-label correlations ≥ 0.72 for 11 of 13 frames |
| **Granularity** | Paragraph vs. 5-sentence context window | Highly robust (≥ 0.85) for 10 of 13 frames |

The multi-label paragraph specification is the preferred and reported
specification.

### Step 6 — Interactive website (`09_website/`)

A React + Recharts application lets users explore the annotated corpus:

- **Security Frames** — top-1 stacked bar and multi-label line chart by year, three-phase narrative, frame definitions and literature grounding, robustness tables and scatter plots
- **Corpus** — paragraph counts by year, country, and political orientation
- **Topics** — word cloud and table of 53 BERTopic clusters with linked frames
- **Explorer** — country and orientation frame profiles (bar chart + radar), 28 national delegations

---

## Project structure

| File | Description |
|---|---|
| [`EP_Security_Debates_Scraper (22April).R`](EP_Security_Debates_Scraper%20(22April).R) | Scraper: EP plenary records (R / rvest) |
| [`security_framing_classification_pipeline.ipynb`](security_framing_classification_pipeline.ipynb) | Classification notebook (Colab) |
| [`README_classification_pipeline.md`](README_classification_pipeline.md) | Full pipeline file layout and Google Drive structure |
| [`09_website/`](09_website/) | React + Recharts interactive explorer |
| [`09_website/src/data/placeholder.js`](09_website/src/data/placeholder.js) | All analysis data (frames, yearly trends, country/orientation totals) |

The classification scripts (`00_translate.py` → `04_robustness_checks.py`) and
data files live on Google Drive:
[classification\_pipeline\_security\_framing](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko)

---

## Environment

**R** (scraping):
Required packages: `rvest`, `dplyr`, `tidyr`, `readr`, `stringr`

**Python** (3.10+, classification pipeline):
```bash
python -m venv .venv
source .venv/bin/activate
pip install transformers bertopic sentence-transformers pandas scikit-learn openpyxl
```

**Website** (Node.js 18+):
```bash
cd 09_website
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

---

## Team

| Contributor | GitHub |
|---|---|
| Niklas Jütting | [@juttingn](https://github.com/juttingn) |
| Victoria Koch | [@victoriackoch](https://github.com/victoriackoch) |
| Natalia F. | [@nataliaf01](https://github.com/nataliaf01) |
| Michal K. | [@michalkolb01](https://github.com/michalkolb01) |

---

*EP9–10 classification pipeline complete. Sciences Po, 2025–2026.*
