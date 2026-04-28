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
   corpus_ep_security.xlsm
        ↓
EP_Corpus_FINAL.R                           ← encoding fix, cleaning, language detection  [in repo]
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

### Step 2 — Corpus cleaning ([`EP_Corpus_FINAL.R`](EP_Corpus_FINAL.R))

The raw corpus (`corpus_ep_security.xlsm`) required extensive cleaning before
analysis. `EP_Corpus_FINAL.R` handles this in a single top-to-bottom run:

- **Encoding repair** — the scraper read HTML UTF-8 bytes as Mac Roman,
  garbling accented characters across all 24 EU languages. A direct character
  substitution table (~130 mappings) corrects double- and triple-corrupted
  sequences without calling `iconv()`.
- **Speaker name & group normalisation** — standardises names, removes role
  prefixes, and maps EP political group labels consistently across EP9 and EP10
  (e.g. ID → PfE).
- **Language detection** — uses `cld3` to detect the true language of each
  speech from text content (the metadata field was unreliable). ~8% of speeches
  are non-English and were later translated for the translation robustness check.

Outputs `corpus_ep_security_CLEAN.xlsx` (text truncated to Excel's 32,767-char
limit) and `corpus_ep_security_CLEAN.csv` (full text). The unit of analysis is
the **paragraph** (blank-line delimited, minimum 450 characters; shorter units
are merged with the next).

An optional translation step ([`00_translate.py`](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko), Google Drive) produces an English version of all speeches for the translation robustness check.

### Step 3 — Topic modelling (BERTopic)

With no prior assumptions about what "security" encompasses, BERTopic maps the
latent topical structure of security-filtered speeches using sentence-transformer
embeddings → UMAP → HDBSCAN. Two variants were run: (a) multilingual ([`02b_bertopic_multilingual.py`](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko), source language), (b) English-translated ([`02a_bertopic_english.py`](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko)). The multilingual variant is
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

### Step 6 — Data enriched with speaker metadata (country, political orientation) for comparative analysis 

## Files

| File | Description |
|---|---|
| `corpus_ep_security_CLEAN.xlsx` | Raw EP debate corpus, cleaned |
| `corpus_ep_security_ENRICHED.xlsx` | Corpus with `country` and `political_orientation` columns added (speech-level) |
| `frames_classified_para_ML.csv` | ML frame classification output — paragraph-level, one row per paragraph |
| `frames_classified_para_ML_enriched.csv` | **Main analysis file** — paragraph-level with `country` and `political_orientation` added |
| `frames_classified_para_ML_enriched.xlsx` | Same as above, Excel format for visualization |
| `country_cache.json` | Local cache of MEP name → country, retrieved from the EP Open Data API |
| `enrich_ep_data.py` | Script that fetches MEP citizenship from the EP API and builds `country_cache.json` |
| `write_columns.py` | Script that writes `country` and `political_orientation` into the ENRICHED Excel file |
| `enrich_frames_csv.py` | **Main enrichment script** — adds country and orientation to the paragraph-level CSV |

---

## Enrichment Logic (`enrich_frames_csv.py`)

### Country
Resolution follows this priority order:

1. **Manual patch** (`MANUAL_COUNTRY` dict) — takes absolute priority, covers encoding-corrupted MEP names, identified institutional speakers, and rapporteurs.
2. **Fuzzy-match recovery** — before the main cache lookup, cache entries with empty country values are matched against resolved entries using normalised ASCII comparison (threshold: 85% via `difflib`). Recovered 4 additional MEPs (e.g. `Viola Von Cramon—Taubadel` → Germany).
3. **Cache lookup** — `country_cache.json`, built from the EP Open Data API, maps MEP names to their citizenship country.
4. **EU body group fallback** — if political_group is Commission, Council, EP President, Other EU Body, or ITRE → `"European Bodies"`.
5. **Rapporteur/Author fallback** — if speaker_type is Rapporteur/Author and still unresolved → `"Rapporteur/Author"`.
6. **Garbled entries** — speaker names that are sentence fragments or titles (e.g. "Le Président", "Elnök asszony") → `"N/A"`.

### Political Orientation
Resolution follows the same priority order:

1. **Manual patch** (`MANUAL_ORIENTATION` dict) — covers speakers with NaN political_group.
2. **Group lookup** — mapped from the `political_group` column:

| Political Group | Orientation |
|---|---|
| GUE/NGL, The Left | Far-Left |
| Verts/ALE, S&D | Left |
| Renew | Center |
| PPE, ECR | Right |
| ID, PfE, ESN, Patriots | Far-Right |
| Commission, Council, EP President, Other EU Body, ITRE | European Bodies |
| NI (Non-Inscrits) | NI |

3. **Rapporteur/Author fallback** — if speaker_type is Rapporteur/Author and group is unknown → `"Rapporteur/Author"`.
4. **Garbled entries** → `"N/A"`.

> **Note on ECR:** Classified as "Right" following the original script convention. Some literature places ECR closer to Far-Right; adjust as needed for your analysis.

### Speaker categories used in both columns

| Label | Who |
|---|---|
| `"European Bodies"` | EU institutional speakers: Commission, Council, EP President, EU Ombudsman, ECB President, EU Committee of the Regions President, etc. |
| `"Other Institutional Speaker"` | Heads of state, prime ministers, foreign dignitaries, and invited non-EU public figures (e.g. Zelenskyy, Tusk, Mitsotakis, Trudeau, Baerbock) |
| `"Rapporteur/Author"` | Speakers labeled as Rapporteur/Author whose political group is unknown |
| `"NI"` | Non-Inscrits MEPs (no group affiliation) |
| `"N/A"` | Garbled entries, sentence fragments, or genuinely unresolvable speakers |

---

## Coverage (paragraph-level, 78,041 rows)

| Column | Resolved | N/A |
|---|---|---|
| `country` | 77,839 (99.7%) | 202 (0.3%) |
| `political_orientation` | 76,634 (98.2%) | 1,407 (1.8%) |

The 202 remaining `N/A` country rows are all MEPs whose names could not be resolved by the EP API at cache-build time and were not recoverable by fuzzy matching.

### Political orientation distribution

| Orientation | Rows |
|---|---|
| European Bodies | 24,529 |
| Right | 15,984 |
| Left | 12,133 |
| Rapporteur/Author | 6,564 |
| Center | 5,642 |
| Far-Right | 4,359 |
| Far-Left | 3,672 |
| Other Institutional Speaker | 2,251 |
| NI | 1,500 |
| N/A | 1,407 |

---

## Frame Scores

Each paragraph receives a continuous score (0–1) for 13 security frames:

`military_defence`, `border_migration`, `terrorism`, `organised_crime`, `cyber`, `foreign_information_interference`, `energy`, `economic`, `environmental`, `health`, `gender_based_violence`, `food_security`, `institutional_procedural`

- `sector_frame_top1`: the dominant frame (highest score)
- `sector_frame_top1_score`: its score
- `sector_frames_multi`: all frames with score > 0.4 (multi-frame paragraphs)

---

## Aggregated Data Files (`aggregate_frames.py`)

Four Excel files are produced for analysis and visualization, all aggregated at **country × year** or **political orientation × year** level. Special labels (European Bodies, Other Institutional Speaker, Rapporteur/Author, N/A) are excluded from both aggregations.

| File | Grouping | Logic |
|---|---|---|
| `aggregated_country_year_topframe.xlsx` | Country × Year | Count of paragraphs where each frame is `sector_frame_top1` |
| `aggregated_country_year_multiframe.xlsx` | Country × Year | Count of paragraphs where each frame appears in `sector_frames_multi` (score > 0.4) |
| `aggregated_orientation_year_topframe.xlsx` | Political Orientation × Year | Same as above, grouped by orientation |
| `aggregated_orientation_year_multiframe.xlsx` | Political Orientation × Year | Same as above, grouped by orientation |

Each file contains:
- `total_paragraphs` — total paragraphs in that group × year cell
- One **count column** per frame (e.g. `military_defence`)
- One **percentage column** per frame (e.g. `pct_military_defence`) — count / total_paragraphs × 100

Frames covered (13 security frames): `military_defence`, `border_migration`, `terrorism`, `organised_crime`, `cyber`, `foreign_information_interference`, `energy`, `economic`, `environmental`, `health`, `gender_based_violence`, `food_security`, `institutional_procedural`

> **`not_security` exclusion:** The ML model assigns a `not_security` label to paragraphs that, despite belonging to a security speech (speech-level filter), are not themselves about security. These paragraphs are excluded from **both numerator and denominator** in all four aggregated files. This means `total_paragraphs` reflects only security-classified paragraphs, giving an unbiased baseline for frame proportions. 15,692 paragraphs (20.1%) were excluded on this basis.

> Note: in multi-frame files, a single paragraph can contribute to multiple frame columns, so counts do not sum to `total_paragraphs`.

### Coverage after filtering

| Subset | Rows (security only) | Groups |
|---|---|---|
| Country subset | 49,373 | 44 countries |
| Orientation subset | 38,253 | 6 orientations (Far-Left, Left, Center, Right, Far-Right, NI) |

### Top frame distribution (country subset, security paragraphs only)

| Frame | Paragraphs |
|---|---|
| economic | 21,811 |
| military_defence | 8,075 |
| energy | 6,401 |
| border_migration | 5,520 |
| terrorism | 4,897 |
| health | 691 |
| gender_based_violence | 501 |
| foreign_information_interference | 361 |
| organised_crime | 279 |
| environmental | 234 |
| institutional_procedural | 209 |
| cyber | 200 |
| food_security | 194 |

---

## LLM Classification (`classify_frames_llm.py`)

Optional second-stage classification of security paragraphs on three analytical dimensions, using the Claude API (Claude Haiku 4.5).

### Questions

| Column | Question | Labels |
|---|---|---|
| `threat_actor` | What type of threat actor, if any, is named or clearly referenced? | `External state actor` / `External non-state actor` / `Internal actor` / `No specific actor` |
| `responsibility` | At what level is security responsibility located (normative framing)? | `EU level` / `Member-state level` / `Shared` / `Not specified` |
| `tone` | What is the dominant tone of the paragraph? | `Urgent/Alarmist` / `Concerned/Assertive` / `Measured/Deliberative` |

### Scope

- Restricted to **security paragraphs only** (`not_security` excluded) from **2023–2025**: ~36,879 paragraphs
- Non-security paragraphs and earlier years excluded by default


### Step 7 — Interactive website ([live site](https://juttingn.github.io/ep-security-debates/) · [`09_website/`](09_website/))

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
| [`EP_Corpus_FINAL.R`](EP_Corpus_FINAL.R) | Corpus cleaning: encoding repair, speaker/group normalisation, language detection (R / tidyverse, cld3) |
| [`security_framing_classification_pipeline.ipynb`](security_framing_classification_pipeline.ipynb) | Classification notebook (Colab) |
| [`README_classification_pipeline.md`](README_classification_pipeline.md) | Full pipeline file layout and Google Drive structure |
| [`09_website/`](09_website/) | React + Recharts interactive explorer |
| [`09_website/src/data/placeholder.js`](09_website/src/data/placeholder.js) | All analysis data (frames, yearly trends, country/orientation totals) |

The classification scripts (`00_translate.py` → `04_robustness_checks.py`) and
data files live on Google Drive:
[classification\_pipeline\_security\_framing](https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko)

---

## Environment

**R** (scraping and corpus cleaning):
Required packages: `rvest`, `tidyverse`, `readxl`, `writexl`, `cld3`, `stringi`

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
| Chiara K. | [@chiarakahler](https://github.com/chiarakahler) |
| Kenza Z. | [@kenzazakarya](https://github.com/kenzazakarya) |

---

*EP9–10 classification pipeline complete. Sciences Po, 2025–2026.*
