# ==============================================================================
# European Parliament Plenary Debates – Security Corpus Scraper
# ==============================================================================
# Project goal:
#   Build a structured corpus of EP plenary speeches on "security" topics
#   (2015–2025): speech text, date, speaker name, and political group.
#
# Data source:
#   European Parliament Open Data Portal – API v2
#   https://data.europarl.europa.eu/api/v2/
#
# HTML structure (confirmed by diagnostic):
#   - Each speech turn is a plain <p> tag (no CSS speaker classes)
#   - Speaker lines follow: "Name (GROUP). – speech text..."
#   - Political group is in parentheses e.g. "(PPE)", "(S&D)"
#   - Continuation <p> tags belong to the current speaker
#   - No MEP ID links in HTML — group extracted directly from speaker line
# ==============================================================================

library(httr)
library(jsonlite)
library(tidyverse)
library(rvest)


# ==============================================================================
# 0. CONFIGURATION
# ==============================================================================

BASE_API      = "https://data.europarl.europa.eu/api/v2"
BASE_EUROPARL = "https://www.europarl.europa.eu/doceo/document"

YEAR_START = 2015
YEAR_END   = 2025

SECURITY_KEYWORDS = c(
  "security", "defence", "defense", "military", "NATO", "threat",
  "terrorism", "cyberattack", "cyber", "hybrid warfare", "intelligence",
  "border control", "migration security", "arms", "weapon", "conflict",
  "war", "sanctions", "geopolitical", "strategic autonomy", "deterrence"
)

DEEPL_API_KEY = Sys.getenv("DEEPL_API_KEY")

dir.create("ep_security_corpus", showWarnings = FALSE)

SLEEP_SEC_API  = 1     # pause between EP API calls (Step 1)
SLEEP_SEC_HTML = 0.5   # pause between HTML page fetches (Step 2/3)


# ==============================================================================
# 1. HELPER FUNCTIONS
# ==============================================================================

# 1a. Safe GET — retries on curl/timeout errors and HTTP 429/503
safe_get = function(url, query_params = list(), max_tries = 4) {
  for (attempt in 1:max_tries) {
    response = tryCatch(
      GET(
        url,
        query  = query_params,
        add_headers(Accept = "application/ld+json"),
        timeout(60)
      ),
      error = function(e) {
        message("  curl error (attempt ", attempt, "): ", conditionMessage(e))
        NULL
      }
    )

    if (is.null(response)) {
      wait = 15 * attempt
      message("  Retrying in ", wait, "s...")
      Sys.sleep(wait)
      next
    }

    if (status_code(response) %in% c(200, 206)) return(response)

    if (status_code(response) %in% c(429, 503)) {
      wait = 15 * attempt
      message("  Rate-limited (", status_code(response), "). Waiting ", wait, "s...")
      Sys.sleep(wait)
    } else {
      message("  HTTP ", status_code(response), " at: ", url)
      return(NULL)
    }
  }
  return(NULL)
}

# 1b. Parse JSON-LD API response into a flat data frame
parse_ep_json = function(response) {
  if (is.null(response)) return(NULL)
  raw_text = content(response, as = "text", encoding = "UTF-8")
  tryCatch(
    fromJSON(raw_text, flatten = TRUE),
    error = function(e) {
      message("  JSON parse error: ", conditionMessage(e))
      NULL
    }
  )
}

# 1c. Returns TRUE if text contains at least one security keyword
contains_security = function(text, keywords = SECURITY_KEYWORDS) {
  if (is.null(keywords)) return(TRUE)
  pattern = paste(keywords, collapse = "|")
  grepl(pattern, text, ignore.case = TRUE, perl = TRUE)
}

# 1d. Minimal text cleaning
clean_text = function(x) {
  x %>%
    str_replace_all("\n", " ") %>%
    str_replace_all(" +", " ") %>%
    trimws()
}

# 1e. (Optional) DeepL translation — only runs if DEEPL_API_KEY is set
translate_deepl = function(text, source_lang = "auto", target_lang = "EN") {
  if (nchar(DEEPL_API_KEY) == 0 || is.na(text) || nchar(text) == 0) return(NA_character_)
  response = tryCatch(
    POST(
      "https://api-free.deepl.com/v2/translate",
      add_headers(`Authorization` = paste("DeepL-Auth-Key", DEEPL_API_KEY)),
      body   = list(text = text, source_lang = source_lang, target_lang = target_lang),
      encode = "form"
    ),
    error = function(e) NULL
  )
  if (is.null(response) || status_code(response) != 200) return(NA_character_)
  result = content(response, as = "parsed", encoding = "UTF-8")
  result$translations[[1]]$text
}


# ==============================================================================
# 2. STEP 1 – RETRIEVE CRE DOCUMENT REFERENCES (by year)
# ==============================================================================
# Queries /plenary-session-documents with work-type=CRE_PLENARY directly,
# skipping the /meetings step. Session date is extracted from the identifier
# e.g. "CRE-10-2024-07-16" -> "2024-07-16".
# distinct() removes duplicate language-version rows, keeping one per date.

get_cre_docs_for_year = function(year) {
  url    = paste0(BASE_API, "/plenary-session-documents")
  params = list(
    `activity-date-start` = paste0(year, "-01-01"),
    `activity-date-end`   = paste0(year, "-12-31"),
    `work-type`           = "CRE_PLENARY",
    format                = "application/ld+json",
    limit                 = 50,
    offset                = 0
  )

  all_docs = NULL
  page     = 0

  repeat {
    params$offset = page * 50
    message("  ", year, " - page ", page, " (offset ", params$offset, ")")

    response = safe_get(url, query_params = params)
    parsed   = parse_ep_json(response)

    if (is.null(parsed) || is.null(parsed$data) || length(parsed$data) == 0) break

    batch    = as_tibble(parsed$data)
    all_docs = bind_rows(all_docs, batch)

    if (nrow(batch) < 50) break
    page = page + 1
    Sys.sleep(SLEEP_SEC_API)
  }

  if (is.null(all_docs)) return(NULL)

  all_docs %>%
    mutate(
      session_date = str_extract(identifier, "\\d{4}-\\d{2}-\\d{2}"),
      year         = year
    ) %>%
    filter(!is.na(session_date)) %>%
    distinct(session_date, .keep_all = TRUE)   # one row per sitting day
}

message("=== STEP 1: Collecting CRE document references (", YEAR_START, "-", YEAR_END, ") ===")
cre_docs_all = NULL

for (yr in YEAR_START:YEAR_END) {
  message("Fetching CRE docs for ", yr, "...")
  batch        = get_cre_docs_for_year(yr)
  cre_docs_all = bind_rows(cre_docs_all, batch)
  Sys.sleep(SLEEP_SEC_API)
}

message("Total unique session dates found: ", nrow(cre_docs_all))
print(cre_docs_all %>% count(year))

# Checkpoint — on future runs, reload with:
#   cre_docs_all = read_csv("ep_security_corpus/cre_docs_index.csv")
# and skip straight to Step 3
write_csv(cre_docs_all, "ep_security_corpus/cre_docs_index.csv")
message("Checkpoint saved: ep_security_corpus/cre_docs_index.csv")


# ==============================================================================
# 3. STEP 2 – PARSE SPEECH TEXT FROM CRE HTML PAGES
# ==============================================================================
# EP HTML uses plain <p> tags throughout. Speaker lines are identified by the
# pattern "Name (GROUP). - speech text" (period + em-dash separator).
# Confirmed by live diagnostic on CRE-10-2024-07-16_EN.html.

parse_cre_html_page = function(html_url, session_date, doc_language = "EN") {
  response = tryCatch(
    GET(html_url, add_headers(`User-Agent` = "Mozilla/5.0"), timeout(60)),
    error = function(e) { message("  HTML fetch error: ", conditionMessage(e)); NULL }
  )
  if (is.null(response) || status_code(response) != 200) return(NULL)

  page = tryCatch(
    read_html(content(response, as = "text", encoding = "UTF-8")),
    error = function(e) NULL
  )
  if (is.null(page)) return(NULL)

  paragraphs = page %>% html_nodes("p")
  if (length(paragraphs) == 0) return(NULL)

  # "Name (GROUP). - speech text" - lazy .+? stops at the first ". -" (em-dash)
  SPEAKER_RE = "^(.+?)\\s*\\.\\s*\u2013\\s*(.*)"

  speeches         = NULL
  current_speaker  = NA_character_
  current_group    = NA_character_
  current_text_buf = character(0)

  flush_speech = function() {
    if (!is.na(current_speaker) && length(current_text_buf) > 0) {
      full_text = paste(current_text_buf, collapse = " ")
      if (contains_security(full_text)) {
        speeches <<- bind_rows(speeches, tibble(
          session_date    = session_date,
          language        = doc_language,
          speaker_name    = current_speaker,
          political_group = current_group,
          speech_text     = clean_text(full_text)
        ))
      }
    }
    current_text_buf <<- character(0)
  }

  for (p in paragraphs) {
    p_text = trimws(html_text(p, trim = TRUE))
    if (nchar(p_text) == 0) next

    # Skip stage directions "(Applause)" and presidency headings "PRESIDENZA:"
    if (grepl("^\\(|^PRESIDENZ", p_text, ignore.case = TRUE)) next

    m = str_match(p_text, SPEAKER_RE)

    if (!is.na(m[1, 1])) {
      # New speaker line - flush previous speaker's speech first
      flush_speech()
      name_raw        = trimws(m[1, 2])
      speech_part     = trimws(m[1, 3])
      current_group   = str_extract(name_raw, "(?<=\\()[^)]+(?=\\))")
      current_speaker = trimws(str_replace(name_raw, "\\s*\\([^)]+\\)$", ""))
      if (nchar(speech_part) > 0) current_text_buf = c(current_text_buf, speech_part)
    } else {
      # Continuation paragraph - accumulate under current speaker
      if (!is.na(current_speaker)) {
        current_text_buf = c(current_text_buf, clean_text(p_text))
      }
    }
  }

  flush_speech()
  speeches
}


# ==============================================================================
# 4. STEP 3 – MAIN LOOP: fetch and parse all CRE pages
# ==============================================================================
message("=== STEP 3: Fetching and parsing CRE HTML pages ===")

corpus_ep = NULL
n_docs    = nrow(cre_docs_all)

for (i in seq_len(n_docs)) {
  doc_row      = cre_docs_all[i, ]
  session_date = coalesce(doc_row$session_date, "")
  identifier   = coalesce(doc_row$identifier,   "")

  if (nchar(identifier) == 0 || nchar(session_date) == 0) next

  html_url = paste0(BASE_EUROPARL, "/", identifier, "_EN.html")
  speeches = parse_cre_html_page(html_url, session_date, doc_language = "EN")

  if (!is.null(speeches) && nrow(speeches) > 0) {
    corpus_ep = bind_rows(corpus_ep, speeches)
  }

  if (i %% 20 == 0) {
    n_collected = if (is.null(corpus_ep)) 0 else nrow(corpus_ep)
    message("  Processed ", i, "/", n_docs, " docs - ", n_collected, " security speeches so far")
    if (n_collected > 0) {
      write_csv(corpus_ep, "ep_security_corpus/corpus_ep_security_CHECKPOINT.csv")
    }
  }

  Sys.sleep(SLEEP_SEC_HTML)
}

message("Raw security speeches collected: ", if (is.null(corpus_ep)) 0 else nrow(corpus_ep))

if (is.null(corpus_ep) || nrow(corpus_ep) == 0) {
  stop("corpus_ep is empty - no security speeches collected. Check HTML parsing.")
}


# ==============================================================================
# 5. FINAL CLEANING & COLUMN SELECTION
# ==============================================================================

corpus_ep = corpus_ep %>%
  mutate(
    session_date = as.Date(session_date),
    year         = lubridate::year(session_date)
  ) %>%
  filter(!is.na(speech_text), nchar(speech_text) > 50) %>%
  distinct(session_date, speaker_name, speech_text, .keep_all = TRUE) %>%
  select(
    session_date,
    year,
    language,
    speaker_name,
    political_group,
    speech_text
  ) %>%
  arrange(session_date, speaker_name)

message("Final corpus size: ", nrow(corpus_ep), " speeches")
print(corpus_ep %>% count(year))


# ==============================================================================
# 6. (OPTIONAL) DEEPL TRANSLATION - 2020-2025 non-English speeches
# ==============================================================================
# Only runs if DEEPL_API_KEY is set in your .Renviron file.
# Add:  DEEPL_API_KEY=<your-key>  to ~/.Renviron to enable.

RUN_TRANSLATION = nchar(DEEPL_API_KEY) > 0

if (RUN_TRANSLATION) {
  message("=== STEP 4: DeepL translation (2020-2025, non-EN speeches) ===")

  corpus_ep      = corpus_ep %>% mutate(speech_text_en = NA_character_)
  translate_rows = which(corpus_ep$year >= 2020 & corpus_ep$language != "EN")
  message("Speeches to translate: ", length(translate_rows))

  for (t_count in seq_along(translate_rows)) {
    idx      = translate_rows[t_count]
    src_lang = toupper(substr(corpus_ep$language[idx], 1, 2))
    corpus_ep$speech_text_en[idx] = translate_deepl(
      text        = corpus_ep$speech_text[idx],
      source_lang = src_lang,
      target_lang = "EN"
    )
    Sys.sleep(0.5)
    if (t_count %% 100 == 0) {
      message("  Translated ", t_count, "/", length(translate_rows))
    }
  }

  corpus_ep = corpus_ep %>%
    mutate(speech_text_en = if_else(language == "EN", speech_text, speech_text_en))

  message("Translation complete.")
} else {
  message("DEEPL_API_KEY not set - skipping translation step.")
}


# ==============================================================================
# 7. SAVE OUTPUTS
# ==============================================================================

write_csv(corpus_ep,    "ep_security_corpus/corpus_ep_security.csv")
write_csv(cre_docs_all, "ep_security_corpus/cre_docs_index.csv")
message("Saved: ep_security_corpus/corpus_ep_security.csv")
message("Saved: ep_security_corpus/cre_docs_index.csv")


# ==============================================================================
# 8. SANITY CHECKS
# ==============================================================================

corpus_ep %>% count(year) %>% print()
corpus_ep %>% count(political_group, sort = TRUE) %>% head(15) %>% print()

corpus_ep %>%
  slice(1) %>%
  select(session_date, speaker_name, political_group, speech_text) %>%
  print()

view(corpus_ep)
