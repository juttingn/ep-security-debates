# Security Framing in the European Parliament

Pipeline for analysing how security framing in EP debates has evolved since
2019, following the approach of the UK / Bundestag migration framing project.

## Project layout on Google Drive

Everything lives under a single project folder on Google Drive (https://drive.google.com/drive/folders/1oUIqaypIW2Cz_0lZ4P3UhrYXNlsLfdko?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto). The
pipeline reads and writes there.

```
/content/drive/MyDrive/classification_pipeline_security_framing/
├── data/
│
│   # ──────────────────────────────────────────────────────────────
│   # INPUT DATA
│   # ──────────────────────────────────────────────────────────────
│   ├── corpus_ep_security_CLEAN.xlsx
│       ← original cleaned corpus (INPUT to step 00)
│
│
│   # ──────────────────────────────────────────────────────────────
│   # STEP 00 — TRANSLATION
│   # ──────────────────────────────────────────────────────────────
│   ├── corpus_ep_security_TRANSLATED.xlsx
│   ├── corpus_ep_security_TRANSLATED_v3.xlsx
│   ├── corpus_ep_security_TRANSLATED_v3_clean.xlsx
│       ← outputs of 00_translate.py / 00_translate_v3.py
│
│   ├── translations_checkpoint.csv
│       ← crash-recovery checkpoint (step 00)
│
│
│   # ──────────────────────────────────────────────────────────────
│   # STEP 01 — SEGMENTATION (UNITS)
│   # ──────────────────────────────────────────────────────────────
│   ├── speeches_ALL_ML.csv
│   ├── speeches_ALL_EN.csv
│
│   ├── sentences_ALL_ML.csv
│   ├── sentences_ALL_EN.csv
│
│   ├── context_windows_ALL_ML.csv
│   ├── context_windows_ALL_EN.csv
│
│       ← produced by 01_segment_units.py
│       (ML = original language, EN = translated)
│
│
│   # ──────────────────────────────────────────────────────────────
│   # STEP 02 — TOPIC CLUSTER MODELLING
│   # ──────────────────────────────────────────────────────────────
│   ├── bertopic_docs_EN_speech.csv
│   ├── bertopic_docs_ML_pooled_speech.csv
│
│   ├── bertopic_info_ML_pooled_speech.csv
│
│   ├── bertopic_model_EN_speech/
│   ├── bertopic_model_ML_pooled_speech/
│
│       ← produced by:
│           02a_bertopic_english.py
│           02b_bertopic_multilingual.py
│
│   ├── embeddings_EN_speech.npy
│   ├── embeddings_ML_pooled_speech.npy
│       ← cached embeddings (safe to delete)
│
│
│   # ──────────────────────────────────────────────────────────────
│   # STEP 03 — FRAME CLASSIFICATION
│   # ──────────────────────────────────────────────────────────────
│
│   # MAIN SPEC (paragraph-level, ML)
│   ├── frames_classified_para_ML.csv
│   ├── frames_classified_para_ML_frame_shares_by_year.csv
│   ├── frames_classified_para_ML_multilabel_shares_by_year.csv
│   ├── frames_classified_para_ML_multilabel_avg_frames_by_year.csv
│   ├── frames_classified_para_ML_multilabel_cooccurrence.csv
│
│   # TRANSLATION ROBUSTNESS (paragraph EN)
│   ├── frames_classified_para_EN.csv
│   ├── frames_classified_para_EN_frame_shares_by_year.csv
│   ├── frames_classified_para_EN_multilabel_shares_by_year.csv
│   ├── frames_classified_para_EN_multilabel_avg_frames_by_year.csv
│   ├── frames_classified_para_EN_multilabel_cooccurrence.csv
│
│   # GRANULARITY ROBUSTNESS (context window ML)
│   ├── frames_classified_context_window_ML.csv
│   ├── frames_classified_context_window_ML_frame_shares_by_year.csv
│   ├── frames_classified_context_window_ML_multilabel_shares_by_year.csv
│   ├── frames_classified_context_window_ML_multilabel_avg_frames_by_year.csv
│   ├── frames_classified_context_window_ML_multilabel_cooccurrence.csv
│
│       ← produced by 03_classify_frames_zeroshot.py
│
│
│   # ──────────────────────────────────────────────────────────────
│   # STEP 04 — ROBUSTNESS CHECKS
│   # ──────────────────────────────────────────────────────────────
│   ├── robustness_full_table.csv
│
│   ├── robustness_multilabel_translation.png
│   ├── robustness_multilabel_granularity.png
│   ├── robustness_top1_translation.png
│   ├── robustness_top1_granularity.png
│
│       ← produced by 04_robustness_checks.py
│
│
├── scripts/
│   ├── frames.py
│   ├── 00_flag_for_retranslation.py
│   ├── 00_translate.py
│   ├── 00_translate_v3.py
│   ├── 00_truncate_loops.py
│   ├── 01_segment_units.py
│   ├── 02a_bertopic_english.py
│   ├── 02b_bertopic_multilingual.py
│   ├── 03_classify_frames_zeroshot.py
│   ├── 04_robustness_checks.py
│   ├── colab_cells.ipynb_source.txt
```

---

## Pipeline overview

```
corpus_ep_security_CLEAN.xlsx
        │
        ▼
[00] 00_translate.py / v3
        │  (adds translation column, checkpointed)
        ▼
corpus_ep_security_TRANSLATED_v3_clean.xlsx
        │
        ▼
[01] 01_segment_units.py
        │  
        │
        ├── speeches
        ├── sentences
        └── context_windows
        │   × {ML, EN}
        ▼

[02a] BERTopic EN        [02b] BERTopic ML
        │
        └── refine frames manually
        ▼

[03] 03_classify_frames_zeroshot.py

    MAIN SPEC:
        --unit para --variant ML

    TRANSLATION CHECK:
        --unit para --variant EN

    GRANULARITY CHECK:
        --unit context_window --variant ML

    OPTIONAL:
        --unit speech
        --unit sentence

    NOTE:
        Paragraph splitting ONLY happens if unit == "para".
        All other units use pre-built segmentation.

        ▼

[04] 04_robustness_checks.py

    (1) ML vs EN (translation)
    (2) paragraph vs context_window (granularity)

    Outputs:
        • correlation table
        • trajectory plots
```

---

## Robustness design

Two independent identification checks:

**(1) Translation**

* ML vs EN at paragraph level
  → tests translation bias

**(2) Granularity**

* paragraph vs context_window (ML)
  → tests unit-of-analysis sensitivity

---

## Core modeling choices

**Multi-label classification**

* frames are not mutually exclusive
* overlap is theoretically expected (securitisation logic)

**Threshold = 0.4**

* aligns with empirical score distribution (lower bound of SD)
* avoids overfiring while preserving recall

**Unit of analysis**

* main: paragraph
* robustness: context_window

---

## Output (core files)

```
frames_classified_{unit}_{variant}.csv
robustness_full_table.csv
robustness_*.png
```

---
