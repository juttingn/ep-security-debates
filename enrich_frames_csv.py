import sys
import json
import unicodedata
import difflib
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Political orientation lookup (by political group) ─────────────────────────
ORIENTATION = {
    "GUE/NGL":                         "Far-Left",
    "The Left":                         "Far-Left",
    "Verts/ALE":                        "Left",
    "S&D":                              "Left",
    "Renew":                            "Center",
    "PPE":                              "Right",
    "ECR":                              "Right",
    "ID":                               "Far-Right",
    "PfE":                              "Far-Right",
    "ESN":                              "Far-Right",
    "Patriots":                         "Far-Right",
    "Commission":                       "European Bodies",
    "Council":                          "European Bodies",
    "EP President":                     "European Bodies",
    "Other EU Body":                    "European Bodies",
    "ITRE":                             "European Bodies",
    "NI":                               "NI",
    "President of the Slovak Republic": "Other Institutional Speaker",
}

EU_BODY_GROUPS = {"Commission", "Council", "EP President", "Other EU Body", "ITRE"}

# ── Manual country patches ────────────────────────────────────────────────────
# Applied before cache lookup and garbled check.
# Categories: real MEPs with encoding artifacts | EU Bodies | Other Institutional Speakers | Rapporteurs
MANUAL_COUNTRY = {
    # --- Real MEPs (encoding artifacts) ---
    "Juan Ignacio Zoido Ålvarez":                    "Spain",
    "Irmhild Boüdorf":                               "Germany",
    "Nikola Bart≈Øšek":                   "Czech Republic",   # Nikola Bartůšek
    "Krzysztof ≈ömiszek":                 "Poland",           # Krzysztof Śmiszek
    "Veronika Cifrová Ostriho≈àová":      "Slovakia",
    "Vilija Blinkeviči≈´tƒó":             "Lithuania",        # Vilija Blinkevičiūtė
    "Jaume Asens Llodr√†":                "Spain",            # Jaume Asens Llodrà
    "Monika Be≈àová":                     "Slovakia",         # Monika Beňová
    "Erik Kali≈àák":                      "Slovakia",         # Erik Kaliňák
    "ƒΩudovít ìdor":                                "Slovakia",         # Ľudovít Ódor
    "Tomasz Piotr PorČba":                     "Poland",           # Tomasz Piotr Poręba
    "Rasa Juknevičienƒó":                           "Lithuania",        # Rasa Juknevičienė
    "Bronis Ropƒó":                                  "Lithuania",        # Bronis Ropė
    "Theresa Muigg":                                 "Austria",
    "Teresa Anjinho":                                "Portugal",
    "Cristina Maestre Martín De Almagro":            "Spain",
    "Enik≈ëGy≈ëri":             "Hungary",          # Enikő Győri
    "Janusz Maksymowicz":                            "Poland",
    # Cyrillic-encoded Bulgarian MEPs
    "–ê—Å–·–º –ê–¥–µ–º–°—“": "Bulgaria",  # Asim Ademov
    "–ê–©–¤—„–µ–· –ö–°–²–°—á–µ–²": "Bulgaria",  # Andrey Kovatchev
    "–Ò–ª—Ö–°–© –ö—é—á—à–«": "Bulgaria",  # Ilhan Kyuchyuk
    # Greek-encoded MEPs (encoding artifact → known to be Greek)
    "ŒöœéœÉœÑŒ±œÇ ŒúŒ±œÖœÅŒØŒ¥Œ∑œÇ":              "Greece",
    "ŒúŒ±œÅŒ≥Œ±œÅŒØœÑŒ∑œÇ Œ£œáŒøŒπŒΩŒ¨œÇ":          "Greece",
    "ŒùŒØŒ∫ŒøœÇ Œ†Œ±œÄŒ±ŒΩŒ¥œÅŒ≠ŒøœÖ":              "Greece",
    "ŒÜŒΩŒΩŒ±-ŒúŒπœÉŒ≠Œª ŒëœÉŒ∑ŒºŒ±Œ∫ŒøœÄŒøœçŒªŒøœÖ": "Greece",
    # Garbled but identifiable MEP
    'Susanna Ceccardi (ID) risposta a un intervento "cartellino blu"': "Italy",

    # --- EU Bodies ---
    "Ursula von der Leyen":          "European Bodies",
    "Maroš Šefčovič":               "European Bodies",
    "Nadia Calviño Santamaría":     "European Bodies",
    "Christine Lagarde":             "European Bodies",
    "Emily O'Reilly":                "European Bodies",
    "EMILY O'REILLY":                "European Bodies",
    "Kadri Simson":                  "European Bodies",
    "Apostolos Tzitzikostas":        "European Bodies",   # President, EU Committee of the Regions

    # --- Other Institutional Speakers (home country) ---
    "Lawrence Gonzi":                "Malta",
    "Petteri Orpo":                  "Finland",
    "Yulia Navalnaya":               "Russia",
    "Klaus Iohannis":                "Romania",
    "Irene Shashar":                 "Israel",
    "Ångeles Moreno Bau":           "Spain",
    "William Ruto":                  "Kenya",
    "Cate Blanchett":                "Australia",
    "Nikol Pashinyan":               "Armenia",
    "Vjosa Osmani":                  "Kosovo",
    "Annalena Baerbock":             "Germany",
    "Saleh Nikbakht":                "Iran",
    "Salome Zourabichvili":          "Georgia",
    "Felipe VI":                     "Spain",
    "Jana Poczobut":                 "Belarus",
    "Irma Dimitradze":               "Georgia",
    "Sergey Tihanovski":             "Belarus",
    "Luc Frieden":                   "Luxembourg",
    "Maia Sandu":                    "Moldova",
    "Sandu Maia":                    "Moldova",
    "Mette Frederiksen":             "Denmark",
    "Nataša Pirc Musar":            "Slovenia",
    "Palina Sharenda-Panasiuk":      "Belarus",
    "Leniie Umerova":                "Ukraine",
    "Donald Tusk":                   "Poland",
    "María Corina Machado":         "Venezuela",
    "Abdullah II":                   "Jordan",
    "Justin Trudeau":                "Canada",
    "Oksana Zabuzhko":               "Ukraine",
    "Xavier Bettel":                 "Luxembourg",
    "Ruslan Stefanchuk":             "Ukraine",
    "Margot Friedländer":           "Germany",
    "Daria Navalnaya":               "Russia",
    "Nana Akufo-Addo":               "Ghana",
    "Alexander De Croo":             "Belgium",
    "Egils Levits":                  "Latvia",
    "Ulf Kristersson":               "Sweden",
    "Zuzana ƒåaputová":             "Slovakia",            # President of Slovakia
    "Gitanas Nausƒóda":              "Lithuania",           # President of Lithuania
    "Mikuláš Bek":                  "Czech Republic",
    "Samantha Cristoforetti":        "Italy",
    "Shirin Ebadi":                  "Iran",
    "Volodymyr Zelenskyy":           "Ukraine",
    "Kyriakos Mitsotakis":           "Greece",
    "Robert Golob":                  "Slovenia",
    "Hakainde Hichilema":            "Zambia",
    "Anže Logar":                   "Slovenia",
    "Mateusz Morawiecki":            "Poland",
    "Mario Draghi":                  "Italy",
    "Sviatlana Tsikhanouskaya":      "Belarus",
    "Tatiana Bucci":                 "Italy",
    "Janusz Komorowski":             "Poland",

    # --- Rapporteurs/Authors (country by nationality) ---
    "Zdzisław KrasnodĚbski":        "Poland",
    "Karol Karski":                  "Poland",
    "Sylvie Brunet":                 "France",
    "Marisa Matias":                 "Portugal",
    "Cristina Guarda":               "Italy",
    "Arnaud Danjean":                "France",
    "Jakop G. Dalunde":              "Sweden",
    "Dimitris Tsiodras":             "Greece",
    "Norbert Neuser":                "Germany",
    "Loucas Fourlas":                "Cyprus",
    "Anouk Van Brug":                "Netherlands",
    "István Ujhelyi":               "Hungary",
    "Jessica Polfjärd":             "Sweden",
    "László Trócsányi":             "Hungary",
    "Maria-Manuel Leitão-Marques":  "Portugal",
    "Susana Solís Pérez":           "Spain",
}

# ── Manual political orientation patches ──────────────────────────────────────
# Only needed for speakers whose political_group is NaN or non-standard.
MANUAL_ORIENTATION = {
    # EU Bodies
    "Ursula von der Leyen":          "European Bodies",
    "Maroš Šefčovič":               "European Bodies",
    "Nadia Calviño Santamaría":     "European Bodies",
    "Christine Lagarde":             "European Bodies",
    "Emily O'Reilly":                "European Bodies",
    "EMILY O'REILLY":                "European Bodies",
    "Kadri Simson":                  "European Bodies",
    "Apostolos Tzitzikostas":        "European Bodies",

    # Other Institutional Speakers
    "Lawrence Gonzi":                "Other Institutional Speaker",
    "Petteri Orpo":                  "Other Institutional Speaker",
    "Yulia Navalnaya":               "Other Institutional Speaker",
    "Klaus Iohannis":                "Other Institutional Speaker",
    "Irene Shashar":                 "Other Institutional Speaker",
    "Ångeles Moreno Bau":           "Other Institutional Speaker",
    "William Ruto":                  "Other Institutional Speaker",
    "Cate Blanchett":                "Other Institutional Speaker",
    "Nikol Pashinyan":               "Other Institutional Speaker",
    "Vjosa Osmani":                  "Other Institutional Speaker",
    "Annalena Baerbock":             "Other Institutional Speaker",
    "Saleh Nikbakht":                "Other Institutional Speaker",
    "Salome Zourabichvili":          "Other Institutional Speaker",
    "Felipe VI":                     "Other Institutional Speaker",
    "Jana Poczobut":                 "Other Institutional Speaker",
    "Irma Dimitradze":               "Other Institutional Speaker",
    "Sergey Tihanovski":             "Other Institutional Speaker",
    "Luc Frieden":                   "Other Institutional Speaker",
    "Maia Sandu":                    "Other Institutional Speaker",
    "Sandu Maia":                    "Other Institutional Speaker",
    "Mette Frederiksen":             "Other Institutional Speaker",
    "Nataša Pirc Musar":            "Other Institutional Speaker",
    "Palina Sharenda-Panasiuk":      "Other Institutional Speaker",
    "Leniie Umerova":                "Other Institutional Speaker",
    "Donald Tusk":                   "Other Institutional Speaker",
    "María Corina Machado":         "Other Institutional Speaker",
    "Abdullah II":                   "Other Institutional Speaker",
    "Justin Trudeau":                "Other Institutional Speaker",
    "Oksana Zabuzhko":               "Other Institutional Speaker",
    "Xavier Bettel":                 "Other Institutional Speaker",
    "Ruslan Stefanchuk":             "Other Institutional Speaker",
    "Margot Friedländer":           "Other Institutional Speaker",
    "Daria Navalnaya":               "Other Institutional Speaker",
    "Nana Akufo-Addo":               "Other Institutional Speaker",
    "Alexander De Croo":             "Other Institutional Speaker",
    "Egils Levits":                  "Other Institutional Speaker",
    "Ulf Kristersson":               "Other Institutional Speaker",
    "Zuzana ƒåaputová":             "Other Institutional Speaker",
    "Gitanas Nausƒóda":              "Other Institutional Speaker",
    "Mikuláš Bek":                  "Other Institutional Speaker",
    "Samantha Cristoforetti":        "Other Institutional Speaker",
    "Shirin Ebadi":                  "Other Institutional Speaker",
    "Volodymyr Zelenskyy":           "Other Institutional Speaker",
    "Kyriakos Mitsotakis":           "Other Institutional Speaker",
    "Robert Golob":                  "Other Institutional Speaker",
    "Hakainde Hichilema":            "Other Institutional Speaker",
    "Anže Logar":                   "Other Institutional Speaker",
    "Mateusz Morawiecki":            "Other Institutional Speaker",
    "Mario Draghi":                  "Other Institutional Speaker",
    "Sviatlana Tsikhanouskaya":      "Other Institutional Speaker",
    "Tatiana Bucci":                 "Other Institutional Speaker",
    "Janusz Komorowski":             "Other Institutional Speaker",
    # Garbled but identifiable MEP — political_group ID already maps correctly,
    # listed here as safety net
    'Susanna Ceccardi (ID) risposta a un intervento "cartellino blu"': "Far-Right",

    # Rapporteurs with NaN political_group
    "Zdzisław KrasnodĚbski":        "Rapporteur/Author",
    "Sylvie Brunet":                 "Rapporteur/Author",
    "Marisa Matias":                 "Rapporteur/Author",
    "Cristina Guarda":               "Rapporteur/Author",
    "Arnaud Danjean":                "Rapporteur/Author",
    "Jakop G. Dalunde":              "Rapporteur/Author",
    "Dimitris Tsiodras":             "Rapporteur/Author",
    "Norbert Neuser":                "Rapporteur/Author",
    "ŒùŒØŒ∫ŒøœÇ Œ†Œ±œÄŒ±ŒΩŒ¥œÅŒ≠ŒøœÖ": "Rapporteur/Author",
    "Anouk Van Brug":                "Rapporteur/Author",
    "Jessica Polfjärd":             "Rapporteur/Author",
    "ŒÜŒΩŒΩŒ±-ŒúŒπœÉŒ≠Œª ŒëœÉŒ∑ŒºŒ±Œ∫ŒøœÄŒøœçŒªŒøœÖ": "Rapporteur/Author",
    "Susana Solís Pérez":           "Rapporteur/Author",
}


# ── Helpers ───────────────────────────────────────────────────────────────────
def normalize_name(name):
    nfkd = unicodedata.normalize("NFKD", str(name))
    ascii_only = nfkd.encode("ascii", "ignore").decode("ascii")
    return " ".join(ascii_only.lower().split())

def is_garbled(name):
    words = str(name).split()
    if len(words) > 7:
        return True
    if len(str(name)) > 60:
        return True
    sentence_clues = [".", ",", "?", "!", "we ", "i ", "the ", "this ", "that "]
    low = str(name).lower()
    if sum(1 for c in sentence_clues if c in low) >= 2:
        return True
    return False


# ── Load data ─────────────────────────────────────────────────────────────────
print("Loading CSV...")
df = pd.read_csv("frames_classified_para_ML.csv")
print(f"  {len(df):,} rows, {df['speaker_name'].nunique():,} unique speakers")

print("Loading country cache...")
with open("country_cache.json", encoding="utf-8") as f:
    raw_cache = json.load(f)
print(f"  {len(raw_cache):,} entries ({sum(1 for v in raw_cache.values() if v):,} with country)")

# ── Fuzzy-match recovery for empty-country entries ────────────────────────────
print("\nRunning fuzzy-match recovery for empty-country cache entries...")
resolved = {k: v for k, v in raw_cache.items() if v}
norm_to_country = {normalize_name(k): v for k, v in resolved.items()}
norm_keys = list(norm_to_country.keys())

patched_cache = dict(raw_cache)
patched = 0
skipped_garbled = 0

for name, country in raw_cache.items():
    if country:
        continue
    if name in MANUAL_COUNTRY:
        continue  # will be handled by manual patch
    if is_garbled(name):
        skipped_garbled += 1
        continue
    norm = normalize_name(name)
    matches = difflib.get_close_matches(norm, norm_keys, n=1, cutoff=0.85)
    if matches:
        recovered_country = norm_to_country[matches[0]]
        patched_cache[name] = recovered_country
        print(f"  PATCHED: {name!r} -> {recovered_country!r}  (via {matches[0]!r})")
        patched += 1

print(f"\n  Fuzzy-patched:     {patched}")
print(f"  Skipped (garbled): {skipped_garbled}")


# ── Enrich the dataframe ──────────────────────────────────────────────────────
print("\nAdding 'country' column...")
def get_country(row):
    name = str(row["speaker_name"]) if pd.notna(row["speaker_name"]) else ""
    # Manual patch takes absolute priority (covers garbled-but-identifiable entries too)
    if name in MANUAL_COUNTRY:
        return MANUAL_COUNTRY[name]
    if is_garbled(name):
        return "N/A"
    country = patched_cache.get(name, "")
    if country:
        return country
    group = str(row["political_group"]) if pd.notna(row["political_group"]) else ""
    if group in EU_BODY_GROUPS:
        return "European Bodies"
    if str(row.get("speaker_type", "")) == "Rapporteur/Author":
        return "Rapporteur/Author"
    return "N/A"

df["country"] = df.apply(get_country, axis=1)

print("Adding 'political_orientation' column...")
def get_orientation(row):
    name = str(row["speaker_name"]) if pd.notna(row["speaker_name"]) else ""
    # Manual patch takes absolute priority
    if name in MANUAL_ORIENTATION:
        return MANUAL_ORIENTATION[name]
    if is_garbled(name):
        return "N/A"
    group = str(row["political_group"]) if pd.notna(row["political_group"]) else ""
    result = ORIENTATION.get(group, "")
    if result:
        return result
    if str(row.get("speaker_type", "")) == "Rapporteur/Author":
        return "Rapporteur/Author"
    return "N/A"

df["political_orientation"] = df.apply(get_orientation, axis=1)

# ── Coverage report ───────────────────────────────────────────────────────────
print("\n=== Coverage Report ===")
print(f"Total rows: {len(df):,}")
print()
print("Country distribution:")
print(df["country"].value_counts().head(15).to_string())
remaining_na = (df["country"] == "N/A").sum()
print(f"  ... N/A: {remaining_na:,}")
print()
print("Orientation distribution:")
print(df["political_orientation"].value_counts().to_string())
print()
print("Remaining N/A country rows by speaker_type:")
print(df[df["country"] == "N/A"]["speaker_type"].value_counts().to_string())

# ── Reorder columns: country + political_orientation after political_group ─────
pg_idx = df.columns.tolist().index("political_group")
other_cols = [c for c in df.columns if c not in ("country", "political_orientation")]
ordered_cols = other_cols[:pg_idx + 1] + ["country", "political_orientation"] + other_cols[pg_idx + 1:]
df = df[ordered_cols]

# ── Save outputs ──────────────────────────────────────────────────────────────
out_csv  = "frames_classified_para_ML_enriched.csv"
out_xlsx = "frames_classified_para_ML_enriched.xlsx"

print(f"\nSaving {out_csv}...")
df.to_csv(out_csv, index=False, encoding="utf-8-sig")

print(f"Saving {out_xlsx}...")
df.to_excel(out_xlsx, index=False, engine="openpyxl")

print("\nDone.")
