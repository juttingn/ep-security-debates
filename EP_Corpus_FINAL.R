# ==============================================================================
# EP Security Corpus — Cleaning Script (FINAL)
# ==============================================================================
# Run this script from top to bottom. It will:
#   1. Load corpus_ep_security.xlsm from your working directory
#   2. Fix all garbled encoding (√°, ≈Ç, ƒç, ‚Äô, ¬†, etc.)
#   3. Clean speaker names and political groups
#   4. Detect true language from speech text
#   5. Save cleaned files to your Desktop
#
# Requirements (install once if needed):
#   install.packages(c("tidyverse", "readxl", "writexl", "cld3"))
# ==============================================================================

library(tidyverse)
library(readxl)
library(writexl)
library(cld3)


# ==============================================================================
# 0. LOAD — keep only the 6 real columns, drop empty ...7 to ...147
# ==============================================================================

corpus = read_excel("corpus_ep_security.xlsm", sheet = "corpus_ep_security") %>%
  select(session_date, year, language, speaker_name, political_group, speech_text)

message("Loaded: ", nrow(corpus), " rows")


# ==============================================================================
# 1. ENCODING FIX
# ==============================================================================
# The scraper read HTML UTF-8 bytes as Mac Roman, garbling accented characters.
# Some text was then re-processed by macOS iconv, creating double/triple corruption.
# Fix: apply a direct substitution table — no iconv() calls, no codec issues.
library(stringi)

PRE_REPLACEMENTS = list(
  c("\u0160", "\u00e4"),   # Š -> ä  (byte 0x8A)
  c("\u017d", "\u00e9"),   # Ž -> é  (byte 0x8E)
  c("\u0161", "\u00f6"),   # š -> ö  (byte 0x9A)
  c("\u017e", "\u00fb"),   # ž -> û  (byte 0x9E)
  c("\u00bc", "\u00ba"),   # ¼ -> º  (byte 0xBC)
  c("\u00bd", "\u03a9"),   # ½ -> Ω  (byte 0xBD)
  c("\u00be", "\u00e6")    # ¾ -> æ  (byte 0xBE)
)

CHAR_SUBS = c(
  # ── Non-breaking space ──────────────────────────────────────────────────────
  "\u00ac\u2020" = " ",        # ¬† → space
  
  # ── C2 range ────────────────────────────────────────────────────────────────
  "\u00ac\u00a9" = "\u00a9",   # ¬© → ©
  "\u00ac\u00ae" = "\u00ae",   # ¬® → ®
  "\u00ac\u00b0" = "\u00b0",   # ¬° → °
  "\u00ac\u00b1" = "\u00b1",   # ¬± → ±
  
  # ── C3 range: accented Latin ─────────────────────────────────────────────────
  "\u221a\u00c0" = "\u00c0",   # √À → À
  "\u221a\u00c1" = "\u00c1",   # √Á → Á
  "\u221a\u00c2" = "\u00c2",   # √Â → Â
  "\u221a\u00c3" = "\u00c3",   # √Ã → Ã
  "\u221a\u00c5" = "\u00c5",   # √Å → Å
  "\u221a\u00c6" = "\u00ee",   # √Æ → î  (C3 AE)
  "\u221a\u00c7" = "\u00c7",   # √Ç → Ç
  "\u221a\u00c8" = "\u00c8",   # √È → È
  "\u221a\u00c9" = "\u00c9",   # √É → É
  "\u221a\u00ca" = "\u00ca",   # √Ê → Ê
  "\u221a\u00cb" = "\u00cb",   # √Ë → Ë
  "\u221a\u00cc" = "\u00cc",   # √Ì → Ì
  "\u221a\u00cd" = "\u00cd",   # √Í → Í
  "\u221a\u00ce" = "\u00ce",   # √Î → Î
  "\u221a\u00cf" = "\u00cf",   # √Ï → Ï
  "\u221a\u00d0" = "\u00d0",   # √Ð → Ð
  "\u221a\u00d1" = "\u00d1",   # √Ñ → Ñ
  "\u221a\u00d2" = "\u00d2",   # √Ò → Ò
  "\u221a\u00d3" = "\u00d3",   # √Ó → Ó
  "\u221a\u00d4" = "\u00d4",   # √Ô → Ô
  "\u221a\u00d5" = "\u00d5",   # √Õ → Õ
  "\u221a\u00d6" = "\u00d6",   # √Ö → Ö
  "\u221a\u00d7" = "\u00d7",   # √× → ×
  "\u221a\u00d8" = "\u00d8",   # √Ø → Ø
  "\u221a\u00d9" = "\u00d9",   # √Ù → Ù
  "\u221a\u00da" = "\u00da",   # √Ú → Ú
  "\u221a\u00db" = "\u00db",   # √Û → Û
  "\u221a\u00dc" = "\u00dc",   # √Ü → Ü
  "\u221a\u00dd" = "\u00dd",   # √Ý → Ý
  "\u221a\u00de" = "\u00de",   # √Þ → Þ
  "\u221a\u00df" = "\u00e7",   # √ß → ç  (C3 A7 — François, NOT German ß which garbles as √ü)
  "\u221a\u00e0" = "\u00e0",   # √à → à
  "\u221a\u00e1" = "\u00e1",   # √á → á
  "\u221a\u00e2" = "\u00e2",   # √â → â
  "\u221a\u00e3" = "\u00e3",   # √ã → ã
  "\u221a\u00e5" = "\u00e5",   # √å → å
  "\u221a\u00e6" = "\u00e6",   # √æ → æ
  "\u221a\u00e7" = "\u00e7",   # √ç → ç
  "\u221a\u00e8" = "\u00e8",   # √è → è
  "\u221a\u00e9" = "\u00e9",   # √é → é
  "\u221a\u00ea" = "\u00ea",   # √ê → ê
  "\u221a\u00eb" = "\u00eb",   # √ë → ë
  "\u221a\u00ec" = "\u00ec",   # √ì → ì
  "\u221a\u00ed" = "\u00ed",   # √í → í
  "\u221a\u00ee" = "\u00ee",   # √î → î
  "\u221a\u00ef" = "\u00ef",   # √ï → ï
  "\u221a\u00f0" = "\u00f0",   # √ð → ð
  "\u221a\u00f2" = "\u00f2",   # √ò → ò
  "\u221a\u00f3" = "\u00f3",   # √ó → ó
  "\u221a\u00f4" = "\u00f4",   # √ô → ô
  "\u221a\u00f5" = "\u00f5",   # √õ → õ
  "\u221a\u00f7" = "\u00f7",   # √÷ → ÷
  "\u221a\u00f8" = "\u00f8",   # √ø → ø
  "\u221a\u00f9" = "\u00f9",   # √ù → ù
  "\u221a\u00fa" = "\u00fa",   # √ú → ú
  "\u221a\u00fb" = "\u00fb",   # √û → û
  "\u221a\u00fd" = "\u00fd",   # √ý → ý
  "\u221a\u00fe" = "\u00fe",   # √þ → þ
  "\u221a\u00ff" = "\u00ff",   # √ÿ → ÿ
  # Mac Roman alternate codes for C3 range
  "\u221a\u00a7" = "\u00e4",   # √§ → ä   (0xC3 0xA4, mac 0xA4=§)
  "\u221a\u00a3" = "\u00e3",   # √£ → ã   (0xC3 0xA3, mac 0xA3=£) — Leitão
  "\u221a\u00fc" = "\u00fc",   # √ü → ü
  "\u221a\u00ba" = "\u00fc",   # √º → ü   (mac 0xBC=º)
  "\u221a\u00bc" = "\u00fc",   # √¼ → ü   (W1252 0xBC=¼) — Günther
  "\u221a\u00b0" = "\u00e1",   # √° → á   (mac 0xA1=°)
  "\u221a\u00b1" = "\u00f1",   # √± → ñ   (mac 0xB1=±)
  "\u221a\u2202" = "\u00f6",   # √∂ → ö   (mac 0xB6=∂)
  "\u221a\u222b" = "\u00fa",   # √∫ → ú   (mac 0xBA=∫)
  "\u221a\u2265" = "\u00f3",   # √≥ → ó   (mac 0xB3=≥)
  "\u221a\u2260" = "\u00ed",   # √≠ → í   (mac 0xAD=≠)
  "\u221a\u00ae" = "\u00e8",   # √® → è   (mac 0xA8=®)
  "\u221a\u00a9" = "\u00e9",   # √© → é   (mac 0xA9=©)
  "\u221a\u2122" = "\u00ea",   # √™ → ê   (mac 0xAA=™)
  "\u221a\u00b4" = "\u00eb",   # √´ → ë   (mac 0xAB=´)
  "\u221a\u00a8" = "\u00ec",   # √¨ → ì   (mac 0xAC=¨)
  "\u221a\u2022" = "\u00e5",   # √• → å   (mac 0xA5=•)
  "\u221a\u03a9" = "\u00fd",   # √Ω → ý   (mac 0xBD=Ω) — Radačovský
  "\u221a\u220f" = "\u00f8",   # √∏ → ø   (mac 0xB8=∏) — Løkkegaard
  "\u221a\u00a5" = "\u00f4",   # √¥ → ô   (mac 0xB4=¥) — Jérôme
  "\u221a\u00a5" = "\u00f4",   # √¥ → ô
  
  # ── C4 range: Czech, Slovak, Polish, Romanian ────────────────────────────────
  "\u0192\u00e7" = "\u010d",   # ƒç → č
  "\u0192\u00c7" = "\u010c",   # ƒÇ → Č
  "\u0192\u00e1" = "\u0107",   # ƒá → ć
  "\u0192\u00c1" = "\u0106",   # ƒÁ → Ć
  "\u0192\u00f5" = "\u011b",   # ƒõ → ě
  "\u0192\u203a" = "\u011b",   # ƒ› → ě   (W1252 alt)
  "\u0192\u00f4" = "\u011a",   # ƒô → Ě
  "\u0192\u00d6" = "\u0105",   # ƒÖ → ą
  "\u0192\u2026" = "\u0105",   # ƒ… → ą   (W1252 alt)
  "\u0192\u00d4" = "\u0104",   # ƒÔ → Ą
  "\u0192\u00f9" = "\u0119",   # ƒù → ę
  "\u0192\u00c9" = "\u0103",   # ƒÉ → ă   (0xC4 0x83) — Romanian ă (Ștefănuță)
  "\u0192\u00c7" = "\u0102",   # ƒÇ → Ă   (0xC4 0x82) — Romanian Ă
  "\u0192\u00e9" = "\u0103",   # ƒé → ă   (alt)
  
  # ── C5 range: Polish ł, Czech š ž, Romanian ş ────────────────────────────────
  "\u2248\u00c7" = "\u0142",   # ≈Ç → ł
  "\u2248\u00c5" = "\u0141",   # ≈Å → Ł
  "\u2248\u00b0" = "\u0161",   # ≈° → š
  "\u2248\u2020" = "\u0160",   # ≈† → Š
  "\u2248\u00e6" = "\u017e",   # ≈æ → ž
  "\u2248\u03a9" = "\u017d",   # ≈Ω → Ž
  "\u2248\u222b" = "\u017a",   # ≈∫ → ź
  "\u2248\u00ba" = "\u017c",   # ≈º → ż
  "\u2248\u00f5" = "\u015b",   # ≈õ → ś
  "\u2248\u203a" = "\u015b",   # ≈› → ś   (W1252 alt)
  "\u2248\u00d1" = "\u0144",   # ≈Ñ → ń
  "\u2248\u201e" = "\u0144",   # ≈„ → ń   (W1252 alt)
  "\u2248\u00c9" = "\u0143",   # ≈É → Ń
  "\u2248\u00f4" = "\u0159",   # ≈ô → ř   — Ondřej
  "\u2248\u00fc" = "\u015f",   # ≈ü → ş   (C5 9F) — Cioloș, Mureșan, Bușoi
  "\u2248\u00fb" = "\u015e",   # ≈û → Ş   (C5 9E) — Ștefănuță uppercase
  
  # ── C8 range: Romanian ș ț (with comma, not cedilla) ─────────────────────────
  "\u00bb\u00f4" = "\u0219",   # »ô → ș   (C8 99)
  "\u00bb\u00f2" = "\u0218",   # »ò → Ș   (C8 98)
  "\u00bb\u00f5" = "\u021b",   # »õ → ț   (C8 9B) — Ștefănuță
  "\u00bb\u00f6" = "\u021a",   # »ö → Ț   (C8 9A)
  
  # ── C6 range: intermediate (double-corruption) ───────────────────────────────
  "\u2206\u00ed" = "\u0192",   # ∆í → ƒ   (C6 92, resolves in next round)
  "\u2206\u00a3" = "\u0192",   # ∆£ → ƒ   (W1252 alt)
  
  # ── Typographic punctuation artefacts ────────────────────────────────────────
  "\u201a\u00c4\u00ec" = "\u2013",   # ‚Äì → –
  "\u201a\u00c4\u00ee" = "\u2014",   # ‚Äî → —
  "\u201a\u00c4\u00f4" = "\u2019",   # ‚Äô → '
  "\u201a\u00c4\u00fa" = "\u201c",   # ‚Äú → "
  "\u201a\u00c4\u00f9" = "\u201d",   # ‚Äù → "
  "\u201a\u00c4\u00b6" = "\u2026",   # ‚Ä¶ → …
  "\u201a\u00c4\u00f2" = "\u2018",   # ‚Äò → '
  
  # ── Special cases ─────────────────────────────────────────────────────────────
  "Erdo\u221a\u00fcan" = "Erdo\u011fan",   # Erdo√üan → Erdoğan
  "Erdo\u00dfan"       = "Erdo\u011fan"    # Erdoßan  → Erdoğan
)

# ── Additional fixes for remaining garbled names ─────────────────────────────
CHAR_SUBS["\u221a\u00a2"] = "\u00e2"   # √¢ → â   (António Tânger Corrêa)
CHAR_SUBS["\u221a\u00f1"] = "\u00d6"   # √ñ → Ö   (Özlem Demirel)
CHAR_SUBS["\u0192\u00c5"] = "\u0101"   # ƒÅ → ā   (Mārtiņš Staķis — Latvian long a)
CHAR_SUBS["\u2248\u00dc"] = "\u0146"   # ≈Ü → ņ   (Mārtiņš — Latvian n with cedilla)
CHAR_SUBS["\u0192\u2211"] = "\u0137"   # ƒ∑ → ķ   (Staķis — Latvian k with cedilla)
CHAR_SUBS["\u2248\u00aa"] = "\u017b"   # ≈ª → Ż   (Krzysztof Żmiszek — Polish Z with dot)

# Sort longest keys first so longer patterns match before shorter ones
CHAR_SUBS = CHAR_SUBS[order(-nchar(names(CHAR_SUBS)))]

fix_column = function(col) {
  # Step 1: swap Windows-1252 chars that block Mac Roman reversal
  for (pair in PRE_REPLACEMENTS) {
    col = stri_replace_all_fixed(col, pair[1], pair[2])
  }
  # Step 2: apply substitution table — 4 rounds handles double/triple corruption
  for (round in 1:4) {
    col_new = stri_replace_all_fixed(col,
                                     names(CHAR_SUBS),
                                     unname(CHAR_SUBS),
                                     vectorize_all = FALSE)
    if (identical(col_new, col)) break
    col = col_new
  }
  # Step 3: tidy up
  col = stri_replace_all_fixed(col, "\u00a0", " ")
  col = stri_replace_all_regex(col, " {2,}", " ")
  stri_trim_both(col)
}

message("Fixing encoding...")
corpus = corpus %>%
  mutate(
    speaker_name    = fix_column(speaker_name),
    political_group = fix_column(political_group),
    speech_text     = fix_column(speech_text),
    language        = fix_column(language)
  )

message("Encoding check (should be clean):")
corpus %>%
  filter(str_detect(speaker_name,
                    "nther|Szyd|Kelly|Lenar|Rzo|Stanis|ois|Jourov|Ciolo|Mure|Ondrej|Leit|Lokkeg|Rad")) %>%
  pull(speaker_name) %>% unique() %>% head(15) %>% print()


# ==============================================================================
# 2. REMOVE JUNK ROWS
# ==============================================================================

corpus = corpus %>%
  filter(
    nchar(as.character(language))        <= 20,
    nchar(as.character(political_group)) <= 60,
    !is.na(speech_text),
    nchar(as.character(speech_text))     >= 100
  )

message("After junk removal: ", nrow(corpus), " rows")


# ==============================================================================
# 3. SESSION DATE
# ==============================================================================
# Excel stores dates as integers 

corpus = corpus %>%
  mutate(
    session_date = as.Date(as.integer(session_date), origin = "1899-12-30"),
    year         = as.integer(format(session_date, "%Y"))
  )
message("Date range: ", min(corpus$session_date), " to ", max(corpus$session_date))


# ==============================================================================
# 4. EXTRACT POLITICAL GROUP FROM SPEAKER NAME SUFFIX
# ==============================================================================

GROUP_PATTERNS = list(
  list(pattern = "PPE|EPP|People.s Party|Ghr.pa PPE",                        group = "PPE"),
  list(pattern = "S&D|Socialistes|Socialists|Sozialdem|socialiste|socjaldem", group = "S&D"),
  list(pattern = "Renew|ALDE|ADLE",                                            group = "Renew"),
  list(pattern = "Verts.ALE|Greens.EFA|Gr.nen|Groenen",                       group = "Verts/ALE"),
  list(pattern = "ECR|Conserv|Reform|Konserwat",                               group = "ECR"),
  list(pattern = "\\bID\\b|Identity|Identit",                                  group = "ID"),
  list(pattern = "The Left|GUE.NGL|Left Group|Linke|Gauche|Sinistra|Lewic",   group = "GUE/NGL"),
  list(pattern = "\\bNI\\b|Non-Inscrits|Non-attached",                         group = "NI"),
  list(pattern = "PfE|Patriots for Europe",                                     group = "PfE"),
  list(pattern = "ESN|Europe of Sovereign Nations",                              group = "ESN")
)

extract_group = function(raw_name) {
  for (pg in GROUP_PATTERNS) {
    if (grepl(pg$pattern, raw_name, ignore.case = TRUE, perl = TRUE))
      return(pg$group)
  }
  NA_character_
}

corpus = corpus %>%
  mutate(
    group_from_suffix     = map_chr(speaker_name, extract_group),
    political_group_clean = case_when(
      !is.na(political_group) &
        !political_group %in% c("NA","NaN","na","") ~ as.character(political_group),
      !is.na(group_from_suffix)                     ~ group_from_suffix,
      TRUE                                          ~ NA_character_
    )
  )

message("Groups recovered from suffix: ",
  sum(!is.na(corpus$group_from_suffix) &
      (is.na(corpus$political_group) |
       corpus$political_group %in% c("NA","NaN","na",""))))


# ==============================================================================
# 5. CLEAN SPEAKER NAME
# ==============================================================================

corpus = corpus %>%
  mutate(
    speaker_name_clean = speaker_name %>%
      str_replace(",.*$", "") %>%                    # drop suffix after comma
      str_replace("\\s*\\([^)]+\\)\\s*$", "") %>%   # drop trailing (GROUP)
      str_replace_all("\\s+", " ") %>%
      trimws()
  )



# ==============================================================================
# 6. TAG SPEAKER TYPE
# ==============================================================================

tag_speaker = function(raw_name) {
  if (grepl(paste(
    "Member of the Commission","Mitglied der Kommission",
    "membre de la Commission","Vice-President of the Commission",
    "Executive Vice-President","President of the Commission",
    "membro della Commissione","Cz.onek Komisji",
    sep="|"), raw_name, ignore.case=TRUE, perl=TRUE)) return("Commission")

  if (grepl(paste(
    "President-in-Office of the Council","amtierender Ratspr",
    "Presidente.*Consejo","Presidente.*Conselho",
    "pr.sident.*Conseil","VPC.HR","High Representative",
    "Haut repr.sentant","alto representante",
    sep="|"), raw_name, ignore.case=TRUE, perl=TRUE)) return("Council")

  if (grepl(paste(
    "^Der Pr.sident$","^Die Pr.sidentin$","^President$","^Presidente$",
    "^Predsedni","^Przewodnicząca$","^Przewodniczaca$",
    "^Elnök$","^Il-President$",
    sep="|"), raw_name, ignore.case=TRUE, perl=TRUE)) return("EP President")

  if (grepl(paste(
    "President EIB","European Investment Bank","Rechnungshof",
    "Court of Auditors","European Council President",
    sep="|"), raw_name, ignore.case=TRUE, perl=TRUE)) return("Other EU Body")

  if (grepl(paste(
    "rapporteur","Berichterstatter","sprawozdaw","ponente",
    "rapporteure","Verfasser","auteur","author","autor",
    "Autora","Verfasserin","na pi.mie","in writing",
    "par .crit","napisan",
    sep="|"), raw_name, ignore.case=TRUE, perl=TRUE)) return("Rapporteur/Author")

  "MEP"
}

corpus = corpus %>%
  mutate(speaker_type = map_chr(speaker_name, tag_speaker)) %>%
  mutate(political_group_clean = case_when(
    speaker_type == "Commission"    ~ "Commission",
    speaker_type == "Council"       ~ "Council",
    speaker_type == "EP President"  ~ "EP President",
    speaker_type == "Other EU Body" ~ "Other EU Body",
    TRUE                            ~ political_group_clean
  ))

message("Speaker types:")
corpus %>% count(speaker_type, sort=TRUE) %>% print()


# ==============================================================================
# 7. LANGUAGE DETECTION
# ==============================================================================

message("Detecting languages (may take a moment)...")
corpus = corpus %>%
  mutate(language_detected = toupper(detect_language(as.character(speech_text))))

message("Language distribution:")
corpus %>% count(language_detected, sort=TRUE) %>% head(15) %>% print()


# ==============================================================================
# 8. BUILD FINAL CORPUS
# ==============================================================================

corpus_clean = corpus %>%
  transmute(
    session_date      = session_date,
    year              = year,
    speaker_name      = speaker_name_clean,
    speaker_type      = speaker_type,
    political_group   = political_group_clean,
    language_detected = language_detected,
    speech_text       = as.character(speech_text),
    speech_text_en    = NA_character_    # placeholder for future translation
  ) %>%
  distinct(session_date, speaker_name, speech_text, .keep_all = TRUE) %>%
  arrange(session_date, speaker_name)

message("\n=== FINAL CORPUS SUMMARY ===")
message("Total speeches:  ", nrow(corpus_clean))
message("Unique speakers: ", n_distinct(corpus_clean$speaker_name))
message("Date range:      ", min(corpus_clean$session_date),
        " to ", max(corpus_clean$session_date))
message("\nPolitical groups:")
corpus_clean %>% count(political_group, sort=TRUE) %>% print()
message("\nSpeeches per year:")
corpus_clean %>% count(year) %>% print()


# ==============================================================================
# 9. SAVE TO DESKTOP
# ==============================================================================

output_folder = "~/Desktop/ep_security_corpus"
dir.create(output_folder, showWarnings = FALSE)

# CSV — full text, no length limit
write_csv(corpus_clean,
          file.path(output_folder, "corpus_ep_security_CLEAN.csv"))

# Excel — speech text truncated to Excel's 32,767 char limit
corpus_clean %>%
  mutate(speech_text = str_trunc(speech_text, 32000)) %>%
  write_xlsx(file.path(output_folder, "corpus_ep_security_CLEAN.xlsx"))

message("\nFiles saved to: ", path.expand(output_folder))
message("  corpus_ep_security_CLEAN2.csv  (full text)")
message("  corpus_ep_security_CLEAN2.xlsx (truncated to 32k chars for Excel)")


# ==============================================================================
# 10. SANITY CHECKS
# ==============================================================================

# Any garbled names remaining?
n_garbled = corpus_clean %>%
  filter(str_detect(speaker_name,
    "[\u221a\u0192\u2248\u2206\u2030\u201a\u00ac\u2021]")) %>%
  nrow()
message("\nSpeaker names still garbled: ", n_garbled, " (should be 0)")

# Preview
message("\nFirst 10 rows:")
corpus_clean %>%
  select(session_date, speaker_name, political_group, language_detected) %>%
  head(10) %>%
  print()

# Non-English speeches that will need translation
n_non_en = sum(corpus_clean$language_detected != "EN",
               na.rm = TRUE)
message("\nNon-English speeches (need translation): ", n_non_en,
        " / ", nrow(corpus_clean))

view(corpus_clean)

path.expand("~/Desktop/ep_security_corpus")
system("open ~/Desktop/ep_security_corpus")
