// ─── EP Security Debates — real data 2019–2026 ────────────────────────────────
// Source: NLI paragraph-level classification, BERTopic topic modelling
// Unit: paragraph (≥450 chars); 78,041 total classified; 37,201 security-labelled
// Coverage: EP9 (Jul 2019–Jun 2024) + EP10 (Jul 2024–early 2026)

export const FRAMES = [
  { id: 'economic',                        label: 'Economic Security',             shortLabel: 'Economic',     color: '#3b82f6' },
  { id: 'military_defence',                label: 'Military Defence',              shortLabel: 'Military',     color: '#ef4444' },
  { id: 'energy',                          label: 'Energy Security',               shortLabel: 'Energy',       color: '#f59e0b' },
  { id: 'terrorism',                       label: 'Terrorism',                     shortLabel: 'Terrorism',    color: '#eab308' },
  { id: 'border_migration',                label: 'Border / Migration',            shortLabel: 'Border',       color: '#f97316' },
  { id: 'health',                          label: 'Health Security',               shortLabel: 'Health',       color: '#14b8a6' },
  { id: 'gender_based_violence',           label: 'Gender-Based Violence',         shortLabel: 'GBV',          color: '#ec4899' },
  { id: 'foreign_information_interference',label: 'Foreign Info. Interference',   shortLabel: 'FII',          color: '#8b5cf6' },
  { id: 'organised_crime',                 label: 'Organised Crime',               shortLabel: 'Org. Crime',   color: '#a855f7' },
  { id: 'environmental',                   label: 'Environmental Security',        shortLabel: 'Environment',  color: '#22c55e' },
  { id: 'food_security',                   label: 'Food Security',                 shortLabel: 'Food',         color: '#84cc16' },
  { id: 'cyber',                           label: 'Cyber Security',                shortLabel: 'Cyber',        color: '#0ea5e9' },
  { id: 'institutional_procedural',        label: 'Institutional / Procedural',   shortLabel: 'Procedural',   color: '#64748b' },
]

export const ORIENTATIONS = [
  { id: 'Far-Left',  label: 'Far-Left',  color: '#b91c1c', total: 3294  },
  { id: 'Left',      label: 'Left',      color: '#ef4444', total: 10409 },
  { id: 'Center',    label: 'Center',    color: '#f59e0b', total: 4913  },
  { id: 'NI',        label: 'NI',        color: '#64748b', total: 1308  },
  { id: 'Right',     label: 'Right',     color: '#3b82f6', total: 13589 },
  { id: 'Far-Right', label: 'Far-Right', color: '#1d4ed8', total: 3688  },
]

export const COUNTRIES = [
  { country: 'Germany',        flag: '🇩🇪', total: 9906,  military_defence: 6610, border_migration: 7553, terrorism: 2964, organised_crime: 1806, cyber: 965,  foreign_information_interference: 746, energy: 5653, economic: 6550, environmental: 308, health: 849, gender_based_violence: 3422, food_security: 1051, institutional_procedural: 343 },
  { country: 'Poland',         flag: '🇵🇱', total: 4921,  military_defence: 2721, border_migration: 3329, terrorism: 3550, organised_crime: 1121, cyber: 838,  foreign_information_interference: 707, energy: 3248, economic: 4519, environmental: 290, health: 534, gender_based_violence: 1491, food_security: 1531, institutional_procedural: 100 },
  { country: 'Ireland',        flag: '🇮🇪', total: 4168,  military_defence: 1977, border_migration: 2732, terrorism: 3171, organised_crime: 959,  cyber: 645,  foreign_information_interference: 359, energy: 2629, economic: 3806, environmental: 174, health: 381, gender_based_violence: 1125, food_security: 938,  institutional_procedural: 81  },
  { country: 'Italy',          flag: '🇮🇹', total: 2841,  military_defence: 1194, border_migration: 1891, terrorism: 1965, organised_crime: 471,  cyber: 331,  foreign_information_interference: 217, energy: 1789, economic: 2540, environmental: 149, health: 278, gender_based_violence: 635,  food_security: 662,  institutional_procedural: 59  },
  { country: 'Netherlands',    flag: '🇳🇱', total: 2790,  military_defence: 1422, border_migration: 1882, terrorism: 2108, organised_crime: 627,  cyber: 527,  foreign_information_interference: 276, energy: 1829, economic: 2579, environmental: 126, health: 209, gender_based_violence: 725,  food_security: 598,  institutional_procedural: 48  },
  { country: 'France',         flag: '🇫🇷', total: 2257,  military_defence: 1012, border_migration: 1600, terrorism: 1756, organised_crime: 623,  cyber: 408,  foreign_information_interference: 282, energy: 1592, economic: 2099, environmental: 81,  health: 181, gender_based_violence: 626,  food_security: 612,  institutional_procedural: 43  },
  { country: 'Spain',          flag: '🇪🇸', total: 2242,  military_defence: 914,  border_migration: 1475, terrorism: 1765, organised_crime: 585,  cyber: 284,  foreign_information_interference: 186, energy: 1535, economic: 2037, environmental: 79,  health: 162, gender_based_violence: 699,  food_security: 590,  institutional_procedural: 39  },
  { country: 'Belgium',        flag: '🇧🇪', total: 1757,  military_defence: 912,  border_migration: 1202, terrorism: 1299, organised_crime: 410,  cyber: 258,  foreign_information_interference: 118, energy: 1163, economic: 1568, environmental: 55,  health: 174, gender_based_violence: 468,  food_security: 435,  institutional_procedural: 30  },
  { country: 'Lithuania',      flag: '🇱🇹', total: 1654,  military_defence: 958,  border_migration: 989,  terrorism: 1320, organised_crime: 283,  cyber: 236,  foreign_information_interference: 137, energy: 1029, economic: 1490, environmental: 37,  health: 104, gender_based_violence: 369,  food_security: 288,  institutional_procedural: 19  },
  { country: 'Romania',        flag: '🇷🇴', total: 1639,  military_defence: 889,  border_migration: 1044, terrorism: 1219, organised_crime: 272,  cyber: 220,  foreign_information_interference: 137, energy: 978,  economic: 1388, environmental: 44,  health: 184, gender_based_violence: 301,  food_security: 382,  institutional_procedural: 25  },
  { country: 'Sweden',         flag: '🇸🇪', total: 1597,  military_defence: 799,  border_migration: 1040, terrorism: 1277, organised_crime: 381,  cyber: 235,  foreign_information_interference: 129, energy: 950,  economic: 1421, environmental: 23,  health: 102, gender_based_violence: 481,  food_security: 285,  institutional_procedural: 19  },
  { country: 'Malta',          flag: '🇲🇹', total: 1445,  military_defence: 621,  border_migration: 898,  terrorism: 1096, organised_crime: 178,  cyber: 156,  foreign_information_interference: 95,  energy: 683,  economic: 1246, environmental: 62,  health: 137, gender_based_violence: 281,  food_security: 225,  institutional_procedural: 14  },
  { country: 'Austria',        flag: '🇦🇹', total: 1443,  military_defence: 899,  border_migration: 1128, terrorism: 413,  organised_crime: 269,  cyber: 146,  foreign_information_interference: 109, energy: 810,  economic: 952,  environmental: 46,  health: 110, gender_based_violence: 494,  food_security: 157,  institutional_procedural: 33  },
  { country: 'Finland',        flag: '🇫🇮', total: 1125,  military_defence: 660,  border_migration: 736,  terrorism: 869,  organised_crime: 239,  cyber: 208,  foreign_information_interference: 99,  energy: 707,  economic: 1007, environmental: 38,  health: 82,  gender_based_violence: 252,  food_security: 234,  institutional_procedural: 21  },
  { country: 'Czech Republic', flag: '🇨🇿', total: 1034,  military_defence: 555,  border_migration: 624,  terrorism: 802,  organised_crime: 199,  cyber: 189,  foreign_information_interference: 116, energy: 655,  economic: 932,  environmental: 25,  health: 68,  gender_based_violence: 248,  food_security: 231,  institutional_procedural: 14  },
  { country: 'Portugal',       flag: '🇵🇹', total: 995,   military_defence: 510,  border_migration: 613,  terrorism: 761,  organised_crime: 185,  cyber: 111,  foreign_information_interference: 53,  energy: 610,  economic: 853,  environmental: 31,  health: 74,  gender_based_violence: 246,  food_security: 242,  institutional_procedural: 17  },
  { country: 'Estonia',        flag: '🇪🇪', total: 958,   military_defence: 678,  border_migration: 607,  terrorism: 783,  organised_crime: 210,  cyber: 187,  foreign_information_interference: 70,  energy: 715,  economic: 856,  environmental: 21,  health: 55,  gender_based_violence: 229,  food_security: 220,  institutional_procedural: 15  },
  { country: 'Croatia',        flag: '🇭🇷', total: 870,   military_defence: 517,  border_migration: 567,  terrorism: 681,  organised_crime: 162,  cyber: 150,  foreign_information_interference: 88,  energy: 561,  economic: 775,  environmental: 17,  health: 98,  gender_based_violence: 202,  food_security: 212,  institutional_procedural: 9   },
  { country: 'Latvia',         flag: '🇱🇻', total: 774,   military_defence: 463,  border_migration: 430,  terrorism: 623,  organised_crime: 134,  cyber: 130,  foreign_information_interference: 53,  energy: 455,  economic: 666,  environmental: 8,   health: 58,  gender_based_violence: 149,  food_security: 137,  institutional_procedural: 13  },
  { country: 'Greece',         flag: '🇬🇷', total: 708,   military_defence: 322,  border_migration: 419,  terrorism: 518,  organised_crime: 114,  cyber: 103,  foreign_information_interference: 64,  energy: 332,  economic: 604,  environmental: 14,  health: 46,  gender_based_violence: 127,  food_security: 87,   institutional_procedural: 9   },
  { country: 'Slovakia',       flag: '🇸🇰', total: 659,   military_defence: 327,  border_migration: 427,  terrorism: 498,  organised_crime: 131,  cyber: 110,  foreign_information_interference: 70,  energy: 432,  economic: 597,  environmental: 17,  health: 52,  gender_based_violence: 168,  food_security: 111,  institutional_procedural: 9   },
  { country: 'Hungary',        flag: '🇭🇺', total: 496,   military_defence: 272,  border_migration: 341,  terrorism: 384,  organised_crime: 139,  cyber: 103,  foreign_information_interference: 84,  energy: 359,  economic: 457,  environmental: 14,  health: 45,  gender_based_violence: 150,  food_security: 120,  institutional_procedural: 12  },
  { country: 'Denmark',        flag: '🇩🇰', total: 494,   military_defence: 277,  border_migration: 328,  terrorism: 384,  organised_crime: 103,  cyber: 94,   foreign_information_interference: 52,  energy: 315,  economic: 455,  environmental: 21,  health: 44,  gender_based_violence: 114,  food_security: 118,  institutional_procedural: 10  },
  { country: 'Luxembourg',     flag: '🇱🇺', total: 483,   military_defence: 206,  border_migration: 321,  terrorism: 332,  organised_crime: 70,   cyber: 51,   foreign_information_interference: 26,  energy: 252,  economic: 426,  environmental: 22,  health: 45,  gender_based_violence: 128,  food_security: 93,   institutional_procedural: 10  },
  { country: 'Bulgaria',       flag: '🇧🇬', total: 473,   military_defence: 254,  border_migration: 301,  terrorism: 379,  organised_crime: 81,   cyber: 90,   foreign_information_interference: 29,  energy: 300,  economic: 403,  environmental: 7,   health: 44,  gender_based_violence: 100,  food_security: 102,  institutional_procedural: 11  },
  { country: 'Slovenia',       flag: '🇸🇮', total: 413,   military_defence: 215,  border_migration: 246,  terrorism: 311,  organised_crime: 86,   cyber: 63,   foreign_information_interference: 30,  energy: 224,  economic: 365,  environmental: 4,   health: 47,  gender_based_violence: 96,   food_security: 88,   institutional_procedural: 2   },
  { country: 'United Kingdom', flag: '🇬🇧', total: 313,   military_defence: 149,  border_migration: 158,  terrorism: 236,  organised_crime: 38,   cyber: 39,   foreign_information_interference: 13,  energy: 153,  economic: 263,  environmental: 6,   health: 19,  gender_based_violence: 55,   food_security: 45,   institutional_procedural: 1   },
  { country: 'Cyprus',         flag: '🇨🇾', total: 109,   military_defence: 53,   border_migration: 66,   terrorism: 85,   organised_crime: 27,   cyber: 19,   foreign_information_interference: 11,  energy: 77,   economic: 100,  environmental: 2,   health: 7,   gender_based_violence: 31,   food_security: 21,   institutional_procedural: 3   },
]

export const ORIENTATION_TOTALS = [
  { orientation: 'Far-Left',  color: '#b91c1c', total: 3294,  military_defence: 1787, border_migration: 2366, terrorism: 2214, organised_crime: 993,  cyber: 496,  foreign_information_interference: 365,  energy: 2470, economic: 2917, environmental: 190, health: 312, gender_based_violence: 1157, food_security: 908,  institutional_procedural: 130 },
  { orientation: 'Left',      color: '#ef4444', total: 10409, military_defence: 5654, border_migration: 7558, terrorism: 6721, organised_crime: 2241, cyber: 1610, foreign_information_interference: 1050, energy: 6872, economic: 8890, environmental: 418, health: 919, gender_based_violence: 3199, food_security: 2132, institutional_procedural: 195 },
  { orientation: 'Center',    color: '#f59e0b', total: 4913,  military_defence: 2737, border_migration: 3438, terrorism: 3444, organised_crime: 1117, cyber: 887,  foreign_information_interference: 530,  energy: 3248, economic: 4286, environmental: 96,  health: 407, gender_based_violence: 1398, food_security: 1062, institutional_procedural: 96  },
  { orientation: 'NI',        color: '#64748b', total: 1308,  military_defence: 700,  border_migration: 924,  terrorism: 819,  organised_crime: 311,  cyber: 206,  foreign_information_interference: 183,  energy: 959,  economic: 1150, environmental: 54,  health: 117, gender_based_violence: 410,  food_security: 322,  institutional_procedural: 40  },
  { orientation: 'Right',     color: '#3b82f6', total: 13589, military_defence: 7927, border_migration: 9452, terrorism: 9085, organised_crime: 2896, cyber: 2219, foreign_information_interference: 1264, energy: 8704, economic: 11574,environmental: 452, health: 1312,gender_based_violence: 3847, food_security: 3100, institutional_procedural: 247 },
  { orientation: 'Far-Right', color: '#1d4ed8', total: 3688,  military_defence: 1959, border_migration: 2719, terrorism: 1671, organised_crime: 811,  cyber: 412,  foreign_information_interference: 454,  energy: 2431, economic: 2938, environmental: 213, health: 302, gender_based_violence: 1237, food_security: 707,  institutional_procedural: 196 },
]

// ─── Top-1 dominant frame shares by year (2019–2026) ─────────────────────────
// Source: frames_classified_para_ML_frame_shares_by_year.csv
// Values are percentages; n = total paragraph count for that year

export const TOP1_YEARLY = [
  { year: 2019, n: 560,   economic: 44.9,  military_defence: 18.87, energy:  9.33, terrorism: 10.63, border_migration: 14.32, health: 0.00, gender_based_violence: 0.43, foreign_information_interference: 0.00, organised_crime: 0.43, environmental: 1.08, food_security: 0.00, cyber: 0.00, institutional_procedural: 0.00 },
  { year: 2020, n: 368,   economic: 41.95, military_defence: 14.77, energy:  9.06, terrorism: 12.42, border_migration: 13.09, health: 5.70, gender_based_violence: 1.68, foreign_information_interference: 0.34, organised_crime: 0.00, environmental: 0.34, food_security: 0.00, cyber: 0.00, institutional_procedural: 0.67 },
  { year: 2021, n: 8933,  economic: 45.91, military_defence: 12.73, energy:  8.22, terrorism: 11.06, border_migration: 12.91, health: 5.35, gender_based_violence: 0.89, foreign_information_interference: 0.40, organised_crime: 0.90, environmental: 0.54, food_security: 0.23, cyber: 0.39, institutional_procedural: 0.47 },
  { year: 2022, n: 17433, economic: 45.47, military_defence: 13.71, energy: 13.80, terrorism: 11.09, border_migration: 10.33, health: 2.18, gender_based_violence: 0.81, foreign_information_interference: 0.49, organised_crime: 0.31, environmental: 0.40, food_security: 0.59, cyber: 0.51, institutional_procedural: 0.31 },
  { year: 2023, n: 17272, economic: 46.27, military_defence: 14.45, energy: 10.96, terrorism: 12.67, border_migration: 11.13, health: 1.25, gender_based_violence: 0.83, foreign_information_interference: 0.58, organised_crime: 0.50, environmental: 0.46, food_security: 0.35, cyber: 0.21, institutional_procedural: 0.34 },
  { year: 2024, n: 12944, economic: 45.06, military_defence: 15.46, energy: 11.14, terrorism: 12.02, border_migration: 10.90, health: 0.83, gender_based_violence: 1.01, foreign_information_interference: 1.32, organised_crime: 0.72, environmental: 0.44, food_security: 0.43, cyber: 0.35, institutional_procedural: 0.33 },
  { year: 2025, n: 15939, economic: 42.95, military_defence: 18.91, energy: 12.64, terrorism: 11.33, border_migration: 10.20, health: 0.48, gender_based_violence: 0.83, foreign_information_interference: 0.75, organised_crime: 0.46, environmental: 0.38, food_security: 0.27, cyber: 0.39, institutional_procedural: 0.42 },
  { year: 2026, n: 4592,  economic: 42.33, military_defence: 17.53, energy: 14.78, terrorism: 11.20, border_migration: 10.61, health: 0.43, gender_based_violence: 1.08, foreign_information_interference: 0.24, organised_crime: 0.40, environmental: 0.22, food_security: 0.19, cyber: 0.48, institutional_procedural: 0.51, partial: true },
]

// ─── Multi-label frame prevalence by year (% paragraphs flagged per frame) ───
// Source: frames_classified_para_ML_multilabel_shares_by_year.csv

export const MULTILABEL_YEARLY = [
  { year: 2019, n: 560,   economic: 67.86, border_migration: 61.61, terrorism: 54.82, energy: 52.68, military_defence: 51.43, gender_based_violence: 26.07, organised_crime: 20.18, food_security: 18.93, cyber: 11.43, health:  6.43, foreign_information_interference:  6.79, environmental: 3.04, institutional_procedural: 1.79 },
  { year: 2020, n: 368,   economic: 63.32, border_migration: 57.61, terrorism: 49.73, energy: 43.21, military_defence: 34.78, gender_based_violence: 20.11, organised_crime: 12.23, food_security: 10.87, cyber:  7.88, health:  9.51, foreign_information_interference:  6.25, environmental: 1.90, institutional_procedural: 1.09 },
  { year: 2021, n: 8933,  economic: 64.12, border_migration: 49.43, terrorism: 48.80, energy: 40.81, military_defence: 37.10, gender_based_violence: 18.49, organised_crime: 14.47, food_security: 11.45, cyber:  8.79, health: 10.30, foreign_information_interference:  5.33, environmental: 2.41, institutional_procedural: 1.29 },
  { year: 2022, n: 17433, economic: 68.43, border_migration: 52.26, terrorism: 54.86, energy: 48.18, military_defence: 42.96, gender_based_violence: 19.62, organised_crime: 13.70, food_security: 16.81, cyber: 10.72, health:  7.66, foreign_information_interference:  6.12, environmental: 2.56, institutional_procedural: 1.15 },
  { year: 2023, n: 17272, economic: 65.86, border_migration: 49.52, terrorism: 51.88, energy: 43.85, military_defence: 39.75, gender_based_violence: 18.66, organised_crime: 13.37, food_security: 14.32, cyber:  9.11, health:  6.21, foreign_information_interference:  5.36, environmental: 2.39, institutional_procedural: 1.30 },
  { year: 2024, n: 12944, economic: 67.39, border_migration: 51.99, terrorism: 53.57, energy: 46.76, military_defence: 42.05, gender_based_violence: 20.68, organised_crime: 15.54, food_security: 14.89, cyber: 10.61, health:  5.89, foreign_information_interference:  7.56, environmental: 2.73, institutional_procedural: 1.41 },
  { year: 2025, n: 15939, economic: 68.44, border_migration: 52.86, terrorism: 54.98, energy: 49.43, military_defence: 45.77, gender_based_violence: 20.58, organised_crime: 15.54, food_security: 16.29, cyber: 11.90, health:  5.73, foreign_information_interference:  6.74, environmental: 2.44, institutional_procedural: 1.83 },
  { year: 2026, n: 4592,  economic: 67.51, border_migration: 51.85, terrorism: 53.77, energy: 49.22, military_defence: 43.16, gender_based_violence: 21.30, organised_crime: 14.72, food_security: 15.37, cyber: 12.30, health:  5.53, foreign_information_interference:  6.34, environmental: 2.13, institutional_procedural: 1.50, partial: true },
]

// ─── Robustness correlation table ────────────────────────────────────────────
// Source: robustness_full_table.csv
// ml_vs_en = translation check; para_vs_window = granularity check

export const ROBUSTNESS_TABLE = [
  { frame: 'energy',                        ml_vs_en_multi: 0.992, para_vs_window_multi: 0.982, ml_vs_en_top1: 0.992, para_vs_window_top1: 0.978 },
  { frame: 'organised_crime',               ml_vs_en_multi: 0.986, para_vs_window_multi: 0.929, ml_vs_en_top1: 0.933, para_vs_window_top1: 0.936 },
  { frame: 'food_security',                 ml_vs_en_multi: 0.981, para_vs_window_multi: 0.984, ml_vs_en_top1: 0.957, para_vs_window_top1: 0.987 },
  { frame: 'border_migration',              ml_vs_en_multi: 0.960, para_vs_window_multi: 0.991, ml_vs_en_top1: 0.821, para_vs_window_top1: 0.976 },
  { frame: 'health',                        ml_vs_en_multi: 0.945, para_vs_window_multi: 0.981, ml_vs_en_top1: 0.997, para_vs_window_top1: 0.999 },
  { frame: 'military_defence',              ml_vs_en_multi: 0.945, para_vs_window_multi: 0.986, ml_vs_en_top1: 0.473, para_vs_window_top1: 0.819 },
  { frame: 'gender_based_violence',         ml_vs_en_multi: 0.930, para_vs_window_multi: 0.934, ml_vs_en_top1: 0.919, para_vs_window_top1: 0.932 },
  { frame: 'cyber',                         ml_vs_en_multi: 0.928, para_vs_window_multi: 0.945, ml_vs_en_top1: 0.978, para_vs_window_top1: 0.976 },
  { frame: 'environmental',                 ml_vs_en_multi: 0.898, para_vs_window_multi: 0.856, ml_vs_en_top1: 0.927, para_vs_window_top1: 0.905 },
  { frame: 'terrorism',                     ml_vs_en_multi: 0.825, para_vs_window_multi: 0.959, ml_vs_en_top1: -0.021, para_vs_window_top1: 0.351 },
  { frame: 'foreign_information_interference', ml_vs_en_multi: 0.760, para_vs_window_multi: 0.692, ml_vs_en_top1: 0.956, para_vs_window_top1: 0.989 },
  { frame: 'economic',                      ml_vs_en_multi: 0.722, para_vs_window_multi: 0.974, ml_vs_en_top1: 0.519, para_vs_window_top1: 0.869 },
  { frame: 'institutional_procedural',      ml_vs_en_multi: 0.492, para_vs_window_multi: 0.412, ml_vs_en_top1: 0.217, para_vs_window_top1: 0.653 },
]

// ─── Frame definitions and literature ────────────────────────────────────────

export const FRAME_DEFINITIONS = {
  military_defence:                 'The speaker refers to armed forces, weapons, NATO commitments, or defence capacity in the context of war or military aggression.',
  border_migration:                 'The speaker frames migration as a large-scale threat requiring border control measures such as asylum restrictions, returns, or external border enforcement.',
  terrorism:                        'The speaker describes a specific terrorist attack, ongoing terrorist threat, or organised extremist violence causing deaths or injuries in Europe.',
  organised_crime:                  'The speaker refers to cross-border organised crime such as drug trafficking, money laundering, weapons trade, or human trafficking.',
  cyber:                            'The speaker refers to cyber attacks, hacking, ransomware, or threats to digital infrastructure such as public services or networks.',
  foreign_information_interference: 'The speaker refers to foreign disinformation, propaganda, or attempts to influence elections or public opinion in Europe.',
  energy:                           'The speaker describes energy supply disruptions, price shocks, or dependence on foreign energy sources as a vulnerability in the context of geopolitical conflict or war.',
  economic:                         'The speaker describes economic coercion, sanctions, or trade restrictions imposed by one country on another to gain political leverage, or economic disruptions to supply chains caused by geopolitical conflict.',
  environmental:                    'The speaker refers to climate change causing instability, conflict, or displacement affecting security.',
  health:                           'The speaker refers to infectious disease outbreaks, pandemics, or biological threats causing illness, deaths, or shortages of medicines.',
  gender_based_violence:            'The speaker refers to gender-based violence including sexual violence, femicide, or trafficking of women in conflict or security contexts.',
  food_security:                    'The speaker refers to disruptions of food supply, grain exports, or food shortages caused by war, blockade, or geopolitical conflict.',
  institutional_procedural:         'The speaker refers to EU procedures, legislation, budgets, or institutional processes without mentioning a specific security threat. (Reference category — non-security)',
}

export const FRAME_LITERATURE = {
  military_defence:                 'Buzan, Wæver & de Wilde (1998) — Military sector',
  border_migration:                 'Buzan et al. (1998) — Societal sector; Huysmans (2000); Léonard & Kaunert (2019)',
  terrorism:                        'Buzan et al. (1998) — Political sector; post-9/11 literature; Stępka (2022)',
  organised_crime:                  'Buzan et al. (1998) — Political sector (distinct risk)',
  cyber:                            'Hansen & Nissenbaum (2009), ISQ 53(4)',
  foreign_information_interference: 'EU Security Union Strategy COM(2020)605; ProtectEU COM(2025)',
  energy:                           'Buzan et al. (1998) — Economic sector',
  economic:                         'Buzan et al. (1998) — Economic sector; Entman (1993)',
  environmental:                    'Buzan et al. (1998) — Environmental sector',
  health:                           'Buzan et al. (1998) — Societal sector',
  gender_based_violence:            'Buzan et al. (1998) — Societal sector (refined)',
  food_security:                    'Buzan et al. (1998) — Economic/Societal sector',
  institutional_procedural:         'Reference/non-security category',
}

// ─── BERTopic clusters (ML model, Step 02) ───────────────────────────────────
// Top clusters by document count; Topic -1 (outliers) and Topic 16 (Maltese) excluded.

export const BERTOPIC_CLUSTERS = [
  { id: 0,  count: 1719, label: 'Ukraine & Russia',             terms: ['ukraine', 'russia', 'putin', 'sanctions', 'defence', 'nato', 'military aggression'],    frames: ['military_defence'] },
  { id: 2,  count: 775,  label: 'Israel–Gaza Conflict',         terms: ['israel', 'gaza', 'hamas', 'ceasefire', 'hostages', 'humanitarian', 'palestinians'],     frames: ['military_defence'] },
  { id: 3,  count: 381,  label: 'Gender-Based Violence',        terms: ['women', 'gender', 'violence', 'equality', 'sexual violence', 'domestic violence'],      frames: ['gender_based_violence'] },
  { id: 5,  count: 339,  label: 'China & Economic Coercion',    terms: ['china', 'hong kong', 'taiwan', 'beijing', 'trade', 'sanctions', 'human rights'],        frames: ['economic'] },
  { id: 7,  count: 338,  label: 'Food & Agriculture',           terms: ['food security', 'farmers', 'agriculture', 'cap', 'pesticides', 'rural'],               frames: ['food_security'] },
  { id: 8,  count: 312,  label: 'Migration & Asylum',           terms: ['migration', 'asylum pact', 'migrants', 'borders', 'returns', 'irregular'],              frames: ['border_migration'] },
  { id: 9,  count: 286,  label: 'Energy Markets',               terms: ['energy prices', 'gas', 'electricity', 'renewables', 'fossil fuels', 'transition'],      frames: ['energy'] },
  { id: 10, count: 251,  label: 'Health & COVID',               terms: ['pandemic', 'vaccines', 'medicines', 'patients', 'covid', 'pharmaceutical'],             frames: ['health'] },
  { id: 11, count: 230,  label: 'NATO & European Defence',      terms: ['european defence', 'nato spending', 'pesco', 'capabilities', 'defence industry'],      frames: ['military_defence'] },
  { id: 12, count: 229,  label: 'Iran: Sanctions & Women',      terms: ['iran', 'mahsa amini', 'irgc', 'women', 'sanctions', 'human rights'],                   frames: ['gender_based_violence'] },
  { id: 13, count: 228,  label: 'Trade, Tariffs & Trump',       terms: ['trade coercion', 'tariffs', 'wto', 'transatlantic', 'trump', 'agreements'],            frames: ['economic'] },
  { id: 15, count: 214,  label: 'Climate & Emissions',          terms: ['climate change', 'emissions', 'carbon', 'paris agreement', 'greenhouse gases'],        frames: ['environmental'] },
  { id: 17, count: 204,  label: 'Russian Gas Dependency',       terms: ['russian gas', 'energy dependency', 'repowereu', 'oil imports', 'fossil fuels'],        frames: ['energy'] },
  { id: 20, count: 182,  label: 'Spyware & Surveillance',       terms: ['spyware', 'pegasus', 'surveillance', 'national security', 'privacy', 'data protection'], frames: ['cyber'] },
  { id: 26, count: 122,  label: 'Digital Services & DSA',       terms: ['dsa platforms', 'digital services', 'online content', 'tiktok', 'algorithms'],        frames: ['foreign_information_interference'] },
  { id: 43, count: 62,   label: 'Organised Crime Networks',     terms: ['organised crime', 'drug trafficking', 'europol', 'trafficking', 'money laundering'],   frames: ['organised_crime'] },
  { id: 47, count: 54,   label: 'Cyber Attacks & NIS2',         terms: ['cybersecurity', 'cyberattacks', 'cyber defence', 'nis2', 'enisa', 'infrastructure'],   frames: ['cyber'] },
  { id: 48, count: 52,   label: 'Disinformation & Elections',   terms: ['disinformation', 'election interference', 'social media', 'fake news', 'musk'],       frames: ['foreign_information_interference'] },
]

export const WORD_CLOUD_DATA = [
  ['ukraine', 1719, 'military_defence'], ['russia', 1719, 'military_defence'], ['nato', 1719, 'military_defence'],
  ['sanctions', 1719, 'military_defence'], ['military aggression', 1719, 'military_defence'],
  ['israel', 775, 'military_defence'], ['gaza', 775, 'military_defence'], ['hamas', 775, 'military_defence'],
  ['ceasefire', 775, 'military_defence'],
  ['women', 381, 'gender_based_violence'], ['gender violence', 381, 'gender_based_violence'],
  ['domestic violence', 381, 'gender_based_violence'],
  ['food security', 338, 'food_security'], ['farmers', 338, 'food_security'], ['agriculture', 338, 'food_security'],
  ['migration', 312, 'border_migration'], ['asylum pact', 312, 'border_migration'],
  ['returns', 312, 'border_migration'], ['irregular borders', 312, 'border_migration'],
  ['energy prices', 286, 'energy'], ['gas', 286, 'energy'], ['renewables', 286, 'energy'],
  ['pandemic', 251, 'health'], ['vaccines', 251, 'health'], ['medicines', 251, 'health'],
  ['european defence', 230, 'military_defence'], ['pesco', 230, 'military_defence'], ['nato spending', 230, 'military_defence'],
  ['iran', 229, 'gender_based_violence'], ['mahsa amini', 229, 'gender_based_violence'],
  ['trade coercion', 228, 'economic'], ['tariffs', 228, 'economic'], ['wto', 228, 'economic'],
  ['climate change', 214, 'environmental'], ['emissions', 214, 'environmental'], ['carbon', 214, 'environmental'],
  ['russian gas', 204, 'energy'], ['energy dependency', 204, 'energy'], ['repowereu', 204, 'energy'],
  ['spyware', 182, 'cyber'], ['pegasus', 182, 'cyber'], ['surveillance', 182, 'cyber'],
  ['dsa platforms', 122, 'foreign_information_interference'], ['disinformation', 52, 'foreign_information_interference'],
  ['election interference', 52, 'foreign_information_interference'],
  ['organised crime', 62, 'organised_crime'], ['drug trafficking', 62, 'organised_crime'],
  ['cybersecurity', 54, 'cyber'], ['nis2', 54, 'cyber'], ['cyberattacks', 54, 'cyber'],
]

// ─── BERTopic full topic list (53 topics; -1 noise and 16 Maltese excluded) ──

export const TOPICS = [
  { id: 0,  count: 1719, name: 'Ukraine & Russia',               terms: ['ukraine','russia','putin','russian','ukrainian','support','war','invasion','troops','nato'] },
  { id: 1,  count: 920,  name: 'Budget & Institutional',          terms: ['budget','european','report','thank','eu','union','work','parliament','proposal','commission'] },
  { id: 2,  count: 775,  name: 'Israel, Gaza & Middle East',      terms: ['israel','gaza','hamas','palestinian','israeli','humanitarian','ceasefire','hostages','icc','occupied'] },
  { id: 3,  count: 381,  name: 'Gender & Violence',               terms: ['women','gender','violence','equality','femicide','trafficking','rights','directive','gbv','protection'] },
  { id: 4,  count: 359,  name: 'Rule of Law (Hungary/Poland)',     terms: ['hungary','orbán','law','poland','rule','judicial','democracy','conditionality','funds','values'] },
  { id: 5,  count: 349,  name: 'China, Hong Kong & Taiwan',       terms: ['china','hong','kong','taiwan','chinese','authoritarian','sanctions','uighurs','tibet','competition'] },
  { id: 6,  count: 339,  name: 'Western Balkans Enlargement',     terms: ['serbia','kosovo','bosnia','enlargement','balkans','western','accession','candidate','status','dialogue'] },
  { id: 7,  count: 338,  name: 'Food & Agriculture Security',     terms: ['farmers','food','agriculture','security','crisis','price','supply','imports','fertiliser','chain'] },
  { id: 8,  count: 312,  name: 'Migration & Asylum Pact',         terms: ['migration','asylum','pact','migrants','borders','border','returns','solidarity','reception','irregular'] },
  { id: 9,  count: 286,  name: 'Energy Prices & Transition',      terms: ['energy','gas','electricity','prices','renewable','supply','crisis','market','transition','dependency'] },
  { id: 10, count: 251,  name: 'Health & Pandemic Preparedness',  terms: ['health','medicines','covid','patients','pandemic','vaccines','preparedness','hera','access','supply'] },
  { id: 11, count: 230,  name: 'European Defence & NATO',         terms: ['defence','nato','europe','european','edtib','pesco','edip','strategic','compass','capability'] },
  { id: 12, count: 229,  name: 'Iran & Sanctions',                terms: ['iran','iranian','regime','women','sanctions','nuclear','deal','jcpoa','mahsa','amini'] },
  { id: 13, count: 228,  name: 'Transatlantic Trade & Tariffs',   terms: ['trade','trump','tariffs','united','states','transatlantic','reciprocal','wto','retaliation','market'] },
  { id: 14, count: 227,  name: 'Syria, Turkey & Türkiye',         terms: ['syria','turkey','türkiye','syrian','turkish','refugees','kurdish','pkk','idlib','opposition'] },
  { id: 15, count: 214,  name: 'Climate & Emissions',             terms: ['climate','emissions','carbon','methane','change','reduction','paris','net','zero','adaptation'] },
  { id: 17, count: 204,  name: 'Russian Energy Dependency',       terms: ['energy','gas','russian','russia','oil','fossil','dependency','pipeline','lng','diversification'] },
  { id: 18, count: 198,  name: 'Belarus & Lukashenko',            terms: ['belarus','lukashenko','belarusian','regime','prisoners','sanctions','opposition','border','hybrid','migrants'] },
  { id: 19, count: 189,  name: 'Procedural Items',                terms: ['item','rsp','group','statements','request','urgent','vote','agenda','procedure','point'] },
  { id: 20, count: 182,  name: 'Spyware & Pegasus',               terms: ['spyware','pegasus','surveillance','national','data','security','services','wiretapping','pega','accountability'] },
  { id: 21, count: 181,  name: 'Single Market & Competitiveness', terms: ['market','single','competitiveness','innovation','draghi','industry','investment','deepening','services','capital'] },
  { id: 22, count: 178,  name: 'Sub-Saharan Africa (Conflict)',    terms: ['congo','africa','rwanda','haiti','burkina','m23','sahel','coup','instability','peacekeeping'] },
  { id: 23, count: 166,  name: 'Media Freedom & Journalism',      terms: ['media','journalists','freedom','press','slapp','malta','daphne','protection','independence','pluralism'] },
  { id: 24, count: 126,  name: 'Georgia & Democratic Backsliding',terms: ['georgia','georgian','country','eu','sovereignty','protest','dream','association','path','values'] },
  { id: 25, count: 123,  name: 'Latin America (Venezuela)',        terms: ['colombia','venezuela','maduro','nicaragua','human','rights','sanctions','opposition','dictator','elections'] },
  { id: 26, count: 122,  name: 'Digital Services & AI Act',       terms: ['digital','data','act','services','online','platforms','dsa','dma','regulation','gatekeepers'] },
  { id: 27, count: 119,  name: 'Housing & Social Poverty',        terms: ['housing','poverty','social','affordable','homelessness','cost','living','young','crisis','inequality'] },
  { id: 28, count: 116,  name: 'Moldova & Neighbourhood',         terms: ['moldova','moldovan','republic','eu','accession','association','frontline','elections','disinformation','support'] },
  { id: 29, count: 109,  name: 'EU Values & Democracy',           terms: ['european','europe','union','people','democracy','values','future','role','world','sovereignty'] },
  { id: 30, count: 107,  name: 'Armenia-Azerbaijan Conflict',     terms: ['armenia','azerbaijan','karabakh','nagorno','conflict','ceasefire','peace','talks','occupation','displaced'] },
  { id: 31, count: 104,  name: 'Afghanistan & Taliban',           terms: ['afghanistan','taliban','afghan','women','girls','rights','education','ban','humanitarian','evacuation'] },
  { id: 32, count: 103,  name: 'Sudan & Humanitarian Crises',     terms: ['sudan','humanitarian','sudanese','conflict','million','displaced','famine','rsf','aid','access'] },
  { id: 33, count: 92,   name: 'Animal Welfare',                  terms: ['animal','welfare','wolf','farmers','livestock','transport','regulation','protection','law','directive'] },
  { id: 34, count: 88,   name: 'AI & Artificial Intelligence',    terms: ['ai','intelligence','artificial','act','generative','regulation','risk','governance','high','model'] },
  { id: 35, count: 86,   name: 'Democratic Security',             terms: ['european','democracy','europe','rules','institutions','backsliding','corruption','accountability','court','values'] },
  { id: 36, count: 84,   name: 'Ocean & Fisheries',               terms: ['fisheries','ocean','marine','fishing','sea','waters','vessels','sustainable','agreement','blue'] },
  { id: 37, count: 82,   name: 'Online Safety & Children',        terms: ['online','children','internet','cyberbullying','grooming','protection','csa','platforms','content','harmful'] },
  { id: 38, count: 76,   name: 'Spain (Domestic Politics)',       terms: ['españa','sánchez','spain','spanish','amnistía','catalan','judicial','sovereignty','vox','independentistas'] },
  { id: 39, count: 76,   name: "Children's Rights",               terms: ['child','children','rights','guarantee','poverty','exploitation','trafficking','protection','agency','welfare'] },
  { id: 40, count: 71,   name: 'Northern Ireland Protocol',       terms: ['ireland','northern','protocol','windsor','framework','gfa','dup','border','goods','irish'] },
  { id: 41, count: 65,   name: 'Tax & OECD Pillar Two',           terms: ['tax','taxation','oecd','agreement','pillar','two','global','minimum','rate','avoidance'] },
  { id: 42, count: 63,   name: 'Nigeria & Religious Persecution', terms: ['nigeria','christians','boko','haram','religious','persecution','killings','farmers','herders','extremism'] },
  { id: 43, count: 62,   name: 'Organised Crime',                 terms: ['crime','organised','criminal','drugs','trafficking','networks','mafias','infiltration','europol','proceeds'] },
  { id: 44, count: 62,   name: 'Automotive & Electric Vehicles',  terms: ['automotive','industry','vehicles','electric','cars','combustion','transition','workers','competitiveness','co2'] },
  { id: 45, count: 59,   name: 'Corruption & Qatargate',          terms: ['corruption','qatargate','transparency','ngos','ethics','money','peva','register','integrity','reform'] },
  { id: 46, count: 57,   name: 'Far-Right & Extremism',           terms: ['far','right','extremism','terror','violence','attack','ideology','radicalisation','threat','domestic'] },
  { id: 47, count: 54,   name: 'Cybersecurity & Cyber Defence',   terms: ['cyber','cybersecurity','defence','security','attacks','resilience','enisa','nis2','infrastructure','state'] },
  { id: 48, count: 52,   name: 'Disinformation & DSA',            terms: ['disinformation','platforms','dsa','content','social','media','foreign','manipulation','election','interference'] },
  { id: 49, count: 50,   name: 'Myanmar & Military Coup',         terms: ['myanmar','junta','military','coup','rights','aung','san','suu','kyi','rohingya'] },
  { id: 50, count: 49,   name: 'Schengen Border Controls',        terms: ['schengen','border','controls','area','reintroduction','free','movement','bulgaria','croatia','accession'] },
  { id: 51, count: 48,   name: 'Green Deal & Transition',         terms: ['green','deal','transition','climate','just','industry','investment','workers','coal','regions'] },
  { id: 52, count: 42,   name: 'Climate Disasters',               terms: ['climate','disaster','water','floods','drought','extreme','weather','adaptation','loss','damage'] },
  { id: 53, count: 42,   name: 'Arctic & Greenland',              terms: ['arctic','greenland','denmark','cooperation','security','sovereignty','resources','ice','shipping','trump'] },
  { id: 54, count: 42,   name: 'Mental Health',                   terms: ['mental','health','young','people','burnout','wellbeing','access','treatment','services','awareness'] },
]
