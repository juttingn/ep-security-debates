// ─── Dimensions ──────────────────────────────────────────────────────────────

export const PERIODS = [
  { id: 'ep4',  label: 'EP4 1994–99', start: 1994, end: 1999 },
  { id: 'ep5',  label: 'EP5 1999–04', start: 1999, end: 2004 },
  { id: 'ep6',  label: 'EP6 2004–09', start: 2004, end: 2009 },
  { id: 'ep7',  label: 'EP7 2009–14', start: 2009, end: 2014 },
  { id: 'ep8',  label: 'EP8 2014–19', start: 2014, end: 2019 },
  { id: 'ep9',  label: 'EP9 2019–24', start: 2019, end: 2024 },
  { id: 'ep10', label: 'EP10 2024–',  start: 2024, end: 2026 },
]

export const COUNTRIES = [
  { code: 'DE', name: 'Germany',        flag: '🇩🇪', speeches: 52000, secPct: 11, dominant: 'cyber' },
  { code: 'FR', name: 'France',         flag: '🇫🇷', speeches: 47000, secPct: 14, dominant: 'military' },
  { code: 'IT', name: 'Italy',          flag: '🇮🇹', speeches: 43000, secPct: 10, dominant: 'border' },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸', speeches: 38000, secPct: 13, dominant: 'terrorism' },
  { code: 'PL', name: 'Poland',         flag: '🇵🇱', speeches: 29000, secPct: 18, dominant: 'military' },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱', speeches: 26000, secPct:  9, dominant: 'cyber' },
  { code: 'RO', name: 'Romania',        flag: '🇷🇴', speeches: 24000, secPct:  8, dominant: 'border' },
  { code: 'BE', name: 'Belgium',        flag: '🇧🇪', speeches: 23000, secPct: 11, dominant: 'terrorism' },
  { code: 'GB', name: 'United Kingdom†',flag: '🇬🇧', speeches: 35000, secPct: 10, dominant: 'military' },
  { code: 'SE', name: 'Sweden',         flag: '🇸🇪', speeches: 19000, secPct: 10, dominant: 'military' },
  { code: 'AT', name: 'Austria',        flag: '🇦🇹', speeches: 17000, secPct:  8, dominant: 'border' },
  { code: 'GR', name: 'Greece',         flag: '🇬🇷', speeches: 16000, secPct: 12, dominant: 'border' },
  { code: 'PT', name: 'Portugal',       flag: '🇵🇹', speeches: 15000, secPct:  7, dominant: 'human' },
  { code: 'HU', name: 'Hungary',        flag: '🇭🇺', speeches: 14000, secPct: 14, dominant: 'border' },
  { code: 'CZ', name: 'Czech Rep.',     flag: '🇨🇿', speeches: 13000, secPct:  9, dominant: 'terrorism' },
  { code: 'DK', name: 'Denmark',        flag: '🇩🇰', speeches: 12000, secPct:  9, dominant: 'cyber' },
  { code: 'FI', name: 'Finland',        flag: '🇫🇮', speeches: 11000, secPct: 10, dominant: 'military' },
  { code: 'SK', name: 'Slovakia',       flag: '🇸🇰', speeches:  9000, secPct:  8, dominant: 'terrorism' },
  { code: 'IE', name: 'Ireland',        flag: '🇮🇪', speeches:  9000, secPct:  4, dominant: 'human' },
  { code: 'BG', name: 'Bulgaria',       flag: '🇧🇬', speeches:  8000, secPct:  9, dominant: 'border' },
  { code: 'HR', name: 'Croatia',        flag: '🇭🇷', speeches:  6000, secPct:  7, dominant: 'border' },
  { code: 'LT', name: 'Lithuania',      flag: '🇱🇹', speeches:  6000, secPct: 16, dominant: 'military' },
  { code: 'SI', name: 'Slovenia',       flag: '🇸🇮', speeches:  4000, secPct:  6, dominant: 'border' },
  { code: 'LV', name: 'Latvia',         flag: '🇱🇻', speeches:  4000, secPct: 15, dominant: 'military' },
  { code: 'EE', name: 'Estonia',        flag: '🇪🇪', speeches:  3000, secPct: 17, dominant: 'cyber' },
  { code: 'CY', name: 'Cyprus',         flag: '🇨🇾', speeches:  3000, secPct:  6, dominant: 'terrorism' },
  { code: 'LU', name: 'Luxembourg',     flag: '🇱🇺', speeches:  3000, secPct:  5, dominant: 'human' },
  { code: 'MT', name: 'Malta',          flag: '🇲🇹', speeches:  2000, secPct:  5, dominant: 'border' },
]

export const PARTIES = [
  { id: 'epp',    party: 'EPP',      fullName: "European People's Party",                    color: '#3b82f6', speeches: 145000, secPct: 12 },
  { id: 'sd',     party: 'S&D',      fullName: 'Progressive Alliance of Socialists & Democrats', color: '#ef4444', speeches: 128000, secPct: 10 },
  { id: 'renew',  party: 'Renew',    fullName: 'Renew Europe',                               color: '#f59e0b', speeches:  89000, secPct:  9 },
  { id: 'ecr',    party: 'ECR',      fullName: 'European Conservatives & Reformists',        color: '#6366f1', speeches:  68000, secPct: 13 },
  { id: 'greens', party: 'Greens/EFA',fullName: 'Greens–European Free Alliance',             color: '#22c55e', speeches:  54000, secPct:  7 },
  { id: 'id',     party: 'ID/PfE',   fullName: 'Identity & Democracy / Patriots for Europe', color: '#a855f7', speeches:  42000, secPct: 16 },
  { id: 'left',   party: 'The Left', fullName: 'GUE–NGL / The Left',                         color: '#ec4899', speeches:  38000, secPct:  6 },
  { id: 'ni',     party: 'NI',       fullName: 'Non-Inscrits',                               color: '#64748b', speeches:  21000, secPct:  8 },
]

export const PARTY_DATA = PARTIES // alias used by Sentiment page

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

// ─── Time series (1994–2025) ──────────────────────────────────────────────────

const RAW = [
  // year, total,  mil, bor, ter, cyb, hum
  [1994,  8200,   410, 328, 328,  82, 246],
  [1995,  9100,   455, 364, 364,  91, 273],
  [1996,  9800,   490, 392, 392,  98, 294],
  [1997, 10200,   510, 408, 408, 102, 306],
  [1998, 10800,   540, 432, 432, 108, 324],
  [1999, 12000,   600, 480, 480, 120, 360],
  [2000, 13500,   675, 540, 540, 135, 405],
  // 9/11 spike: terrorism + border surge
  [2001, 14200,   994, 710,2272, 142, 497],
  [2002, 14800,  1184, 888,2516, 178, 592],
  [2003, 15100,  1357, 906,2643, 227, 604],
  [2004, 14900,  1192, 895,2384, 298, 596],
  [2005, 16200,  1134, 972,2268, 324, 648],
  [2006, 16800,  1008,1008,2184, 504, 672],
  [2007, 17200,  1032,1032,2064, 688, 688],
  [2008, 17600,  1056,1056,1936, 880, 704],
  [2009, 16800,  1008, 840,1680,1008, 672],
  [2010, 18200,  1092, 910,1638,1274, 728],
  [2011, 18800,  1128, 940,1692,1504, 752],
  [2012, 19200,  1152, 960,1728,1728, 768],
  [2013, 19600,  1176, 980,1764,2156, 784],
  // 2014: EP election, moderate
  [2014, 18400,  1104, 920,1656,2208, 736],
  // 2015–16: refugee crisis + Paris attacks
  [2015, 20100,  1407,4020,3618,2010, 804],
  [2016, 20800,  1664,4368,3744,2288, 832],
  [2017, 21200,  1484,3180,2756,2756, 848],
  [2018, 21600,  1728,2592,2376,3240, 864],
  [2019, 19800,  1584,2178,1980,3564, 792],
  // 2020: COVID (health security)
  [2020, 16200,  1296,1620,1296,2916,1944],
  [2021, 19400,  1940,1940,1746,3880,1552],
  // 2022: Ukraine invasion — military explodes
  [2022, 22100,  7956,2210,1990,3536,1105],
  [2023, 23400,  8658,2340,2106,4212,1170],
  [2024, 22800,  7980,2280,1824,4560,1140],
  [2025,  8200,  2952, 820,  656,1640, 410],
]

export const YEARLY_DATA = RAW.map(([year, total, military, border, terrorism, cyber, human]) => ({
  year, total, military, border, terrorism, cyber, human,
  security: military + border + terrorism + cyber + human,
}))

// ─── Topics ──────────────────────────────────────────────────────────────────

export const TOPICS = [
  { id: 1,  label: 'NATO & Collective Defence',       terms: ['NATO','defence','military','troops','Article5','deterrence','allies','collective','spending','capability'] },
  { id: 2,  label: 'Border Security & Migration',     terms: ['border','Frontex','migration','asylum','irregular','Schengen','smuggling','arrivals','returns','patrol'] },
  { id: 3,  label: 'Counter-terrorism & Extremism',   terms: ['terrorism','attack','extremism','radicalisation','foreign fighters','threat','Europol','prevention','jihadist','intelligence'] },
  { id: 4,  label: 'Cybersecurity & Digital Infra',   terms: ['cyber','digital','network','infrastructure','ENISA','attack','resilience','data','encryption','5G'] },
  { id: 5,  label: 'Energy Security',                 terms: ['energy','gas','pipeline','supply','Russia','diversification','dependency','LNG','renewable','strategic'] },
  { id: 6,  label: 'Climate & Environmental Risks',   terms: ['climate','floods','drought','disaster','resilience','adaptation','risk','environmental','heatwave','security'] },
  { id: 7,  label: 'Global Health Security',          terms: ['pandemic','health','vaccine','WHO','preparedness','outbreak','COVID','disease','biosecurity','stockpile'] },
  { id: 8,  label: 'Economic Security & Sanctions',   terms: ['sanctions','trade','export','restriction','strategic','autonomy','supply chain','dependency','critical','derisking'] },
  { id: 9,  label: 'Intelligence & Oversight',        terms: ['intelligence','surveillance','services','oversight','Pegasus','spyware','data','privacy','wiretapping','accountability'] },
  { id: 10, label: 'Law Enforcement Cooperation',     terms: ['Europol','Eurojust','police','cooperation','PCTF','database','SIS','data exchange','crossborder','crime'] },
  { id: 11, label: 'Fundamental Rights & Security',   terms: ['rights','liberty','detention','privacy','proportionality','ECHR','surveillance','profiling','discrimination','balance'] },
  { id: 12, label: 'Nuclear Safety',                  terms: ['nuclear','non-proliferation','NPT','IAEA','disarmament','Euratom','reactor','waste','enrichment','deterrence'] },
  { id: 13, label: 'Food & Agricultural Security',    terms: ['food','agriculture','supply','hunger','crisis','price','famine','fertiliser','GMO','storage'] },
  { id: 14, label: 'Hybrid Warfare & Disinfo',        terms: ['hybrid','disinformation','propaganda','election','interference','covert','manipulation','state-sponsored','StratCom','influence'] },
  { id: 15, label: 'Rule of Law & Democratic Security', terms: ['rule of law','democracy','institutions','authoritarian','backsliding','judiciary','press','freedom','values','conditionality'] },
  { id: 16, label: 'Internal Market & Security Regulation', terms: ['regulation','market','product','safety','standard','compliance','harmonisation','framework','directive','certification'] },
  { id: 17, label: 'EU Security Architecture',        terms: ['CSDP','PESCO','EDA','EDIP','strategic compass','autonomy','EU army','battlegroup','capability','interoperability'] },
  { id: 18, label: 'International Crisis Management', terms: ['mission','peacekeeping','Mali','Bosnia','Somalia','Libya','mandate','UN','civilian','operation'] },
  { id: 19, label: 'Critical Infrastructure Protection', terms: ['infrastructure','CIP','energy grid','pipeline','submarine cable','ports','airports','resilience','attack','protection'] },
  { id: 20, label: 'AI & Technology Security',        terms: ['AI','artificial intelligence','algorithm','autonomous','dual-use','export control','semiconductor','chip','surveillance','regulation'] },
]

// Topic salience by EP period (0–100 index)
export const TOPIC_HEATMAP = [
  //                   ep4  ep5  ep6  ep7  ep8  ep9 ep10
  { topic: 'NATO',      v: [38,  42,  45,  50,  55,  68,  85] },
  { topic: 'Border',    v: [30,  35,  40,  45,  82,  65,  55] },
  { topic: 'Terrorism', v: [25,  40,  72,  68,  70,  58,  50] },
  { topic: 'Cyber',     v: [10,  12,  18,  28,  45,  65,  78] },
  { topic: 'Energy',    v: [30,  35,  52,  58,  45,  72,  80] },
  { topic: 'Climate',   v: [15,  20,  25,  35,  48,  68,  72] },
  { topic: 'Health',    v: [20,  22,  25,  28,  32,  75,  55] },
  { topic: 'Economic',  v: [18,  22,  28,  38,  42,  55,  70] },
  { topic: 'Intel',     v: [20,  25,  30,  48,  55,  60,  58] },
  { topic: 'LawEnf',    v: [28,  35,  45,  50,  52,  55,  52] },
  { topic: 'Rights',    v: [35,  40,  45,  55,  58,  60,  62] },
  { topic: 'Nuclear',   v: [32,  35,  38,  40,  35,  30,  28] },
  { topic: 'Food',      v: [22,  25,  28,  30,  32,  40,  45] },
  { topic: 'Hybrid',    v: [10,  12,  15,  22,  42,  65,  75] },
  { topic: 'RuleOfLaw', v: [25,  30,  35,  40,  52,  68,  72] },
  { topic: 'Market',    v: [30,  35,  40,  42,  45,  48,  50] },
  { topic: 'CSDP',      v: [28,  35,  42,  48,  52,  62,  80] },
  { topic: 'Crisis',    v: [32,  38,  45,  50,  48,  45,  55] },
  { topic: 'CritInfra', v: [15,  18,  22,  30,  42,  58,  72] },
  { topic: 'AI',        v: [ 5,   6,   8,  12,  22,  50,  82] },
]

// ─── Sentiment ────────────────────────────────────────────────────────────────

export const SENTIMENT_BY_FRAME = [
  { frame: 'military',  label: 'Military',      score:  0.08, positive: 42, neutral: 35, negative: 23 },
  { frame: 'border',    label: 'Border',        score: -0.12, positive: 22, neutral: 32, negative: 46 },
  { frame: 'terrorism', label: 'Counter-terr.', score: -0.18, positive: 18, neutral: 30, negative: 52 },
  { frame: 'cyber',     label: 'Cyber',         score: -0.06, positive: 28, neutral: 42, negative: 30 },
  { frame: 'human',     label: 'Human Sec.',    score: -0.22, positive: 15, neutral: 28, negative: 57 },
]

export const SENTIMENT_BY_PARTY = [
  { party: 'EPP',       score:  0.06 },
  { party: 'S&D',       score: -0.08 },
  { party: 'Renew',     score:  0.02 },
  { party: 'Greens/EFA',score: -0.15 },
  { party: 'ECR',       score:  0.04 },
  { party: 'ID/PfE',    score:  0.14 },
  { party: 'The Left',  score: -0.20 },
  { party: 'NI',        score:  0.01 },
]

export const SENTIMENT_YEARLY = YEARLY_DATA.map(({ year }, i) => {
  const base = -0.04
  const noise = Math.sin(i * 0.9) * 0.06
  const crises = year === 2001 ? -0.12 : year === 2002 ? -0.10 : year === 2015 ? -0.14 : year === 2016 ? -0.12 : year === 2022 ? -0.18 : year === 2023 ? -0.15 : 0
  return { year, sentiment: parseFloat((base + noise + crises).toFixed(3)) }
})

// ─── LLM annotation ──────────────────────────────────────────────────────────

export const LLM_DATA = {
  agreementScore: 0.81,
  sampleSize: 450,
  euVsNational: [
    { category: 'EU-level framing', count: 5180, pct: 43 },
    { category: 'National interest', count: 4330, pct: 36 },
    { category: 'Mixed / unclear',  count: 2520, pct: 21 },
  ],
  urgency: [
    { level: 'High urgency',   count: 4450, pct: 37 },
    { level: 'Moderate',       count: 5420, pct: 45 },
    { level: 'Measured',       count: 2160, pct: 18 },
  ],
  crossFrame: [
    { combination: 'Military + Cyber',      pct: 14 },
    { combination: 'Border + Terrorism',    pct: 22 },
    { combination: 'Energy + Military',     pct: 11 },
    { combination: 'Hybrid + Cyber',        pct: 16 },
    { combination: 'Human + Border',        pct:  9 },
    { combination: 'Climate + Human',       pct:  8 },
    { combination: 'Other combos',          pct: 20 },
  ],
}

// ─── MEPs ─────────────────────────────────────────────────────────────────────

export const MEPS = [
  { id: 1,  name: 'Markus Völker',      country: 'Germany',    party: 'EPP',       periods: ['8th','9th','10th'], totalSpeeches: 1240, securitySpeeches: 186, securityPct: 15, dominantFrame: 'cyber',    sentimentScore:  0.04, frameBreakdown: { military: 20, border: 10, terrorism: 15, cyber: 38, human: 17 }, notableQuote: 'Europe cannot afford to be naive about the digital battlefield. Our adversaries have long since moved the theatre of conflict into our networks.' },
  { id: 2,  name: 'Isabelle Renard',    country: 'France',     party: 'Renew',     periods: ['9th','10th'],       totalSpeeches:  820, securitySpeeches: 115, securityPct: 14, dominantFrame: 'military', sentimentScore:  0.09, frameBreakdown: { military: 42, border: 12, terrorism: 18, cyber: 16, human: 12 }, notableQuote: 'Strategic autonomy is not nationalism — it is the prerequisite for meaningful multilateralism. Without the capacity to act, European solidarity is an empty phrase.' },
  { id: 3,  name: 'Agnieszka Wiśniewska', country: 'Poland',  party: 'ECR',       periods: ['8th','9th','10th'], totalSpeeches:  940, securitySpeeches: 207, securityPct: 22, dominantFrame: 'military', sentimentScore:  0.15, frameBreakdown: { military: 58, border: 16, terrorism: 10, cyber: 12, human:  4 }, notableQuote: 'For Poland, Article 5 is not a theoretical construct. We share a border with a country that has openly defied the post-war international order.' },
  { id: 4,  name: 'Sofia Papadimitriou',country: 'Greece',     party: 'S&D',       periods: ['7th','8th','9th'],  totalSpeeches: 1080, securitySpeeches: 140, securityPct: 13, dominantFrame: 'border',   sentimentScore: -0.11, frameBreakdown: { military: 12, border: 48, terrorism: 14, cyber:  8, human: 18 }, notableQuote: 'The Mediterranean is not merely a migration route — it is a graveyard. We have replaced the language of human rights with the language of threat management.' },
  { id: 5,  name: 'Lars Lindqvist',     country: 'Sweden',     party: 'EPP',       periods: ['9th','10th'],       totalSpeeches:  640, securitySpeeches:  96, securityPct: 15, dominantFrame: 'military', sentimentScore:  0.12, frameBreakdown: { military: 50, border: 10, terrorism: 12, cyber: 22, human:  6 }, notableQuote: 'Sweden\'s accession to NATO is not the end of our security journey — it is the beginning. We now have obligations that require investment, doctrine and political will.' },
  { id: 6,  name: 'Giulia Bernardi',    country: 'Italy',      party: 'S&D',       periods: ['8th','9th','10th'], totalSpeeches: 1020, securitySpeeches:  92, securityPct:  9, dominantFrame: 'human',    sentimentScore: -0.18, frameBreakdown: { military: 10, border: 22, terrorism: 18, cyber:  8, human: 42 }, notableQuote: 'We speak endlessly of the security of borders. I ask when we will speak of the security of people. Asylum seekers are not threats — they are people fleeing them.' },
  { id: 7,  name: 'Viktor Horváth',     country: 'Hungary',    party: 'NI',        periods: ['8th','9th'],        totalSpeeches:  720, securitySpeeches: 122, securityPct: 17, dominantFrame: 'border',   sentimentScore:  0.18, frameBreakdown: { military: 14, border: 62, terrorism: 14, cyber:  4, human:  6 }, notableQuote: 'Every sovereign nation has the right and duty to protect its borders. This is not ideology — this is the basic function of the state.' },
  { id: 8,  name: 'Katrien De Smedt',   country: 'Belgium',    party: 'Renew',     periods: ['7th','8th','9th'],  totalSpeeches:  890, securitySpeeches: 107, securityPct: 12, dominantFrame: 'terrorism',sentimentScore: -0.08, frameBreakdown: { military: 12, border: 16, terrorism: 42, cyber: 18, human: 12 }, notableQuote: 'Brussels learned in 2016 what Paris learned in 2015: that security cannot be outsourced to intelligence agencies alone. It requires community resilience.' },
  { id: 9,  name: 'Eero Mäkinen',       country: 'Finland',    party: 'EPP',       periods: ['9th','10th'],       totalSpeeches:  550, securitySpeeches:  77, securityPct: 14, dominantFrame: 'military', sentimentScore:  0.10, frameBreakdown: { military: 48, border:  8, terrorism: 10, cyber: 28, human:  6 }, notableQuote: 'Finland has maintained 900,000 trained reservists for decades. We did not do this out of paranoia — we did it because geography is not optional.' },
  { id: 10, name: 'Camille Fontaine',   country: 'France',     party: 'Greens/EFA',periods: ['9th','10th'],       totalSpeeches:  480, securitySpeeches:  34, securityPct:  7, dominantFrame: 'human',    sentimentScore: -0.24, frameBreakdown: { military:  8, border: 10, terrorism:  8, cyber: 12, human: 62 }, notableQuote: 'Climate change is the most profound threat multiplier the world has ever seen. Every flood, every drought, every failed harvest is also a security event.' },
  { id: 11, name: 'Renata Novotná',     country: 'Czech Rep.', party: 'ECR',       periods: ['8th','9th','10th'], totalSpeeches:  780, securitySpeeches: 109, securityPct: 14, dominantFrame: 'terrorism',sentimentScore:  0.06, frameBreakdown: { military: 22, border: 20, terrorism: 38, cyber: 14, human:  6 }, notableQuote: 'Europol is not enough. We need genuine operational cooperation — not only data sharing but joint operations with real consequences for criminal networks.' },
  { id: 12, name: 'Andrius Žukauskas',  country: 'Lithuania',  party: 'EPP',       periods: ['8th','9th','10th'], totalSpeeches:  620, securitySpeeches: 130, securityPct: 21, dominantFrame: 'military', sentimentScore:  0.14, frameBreakdown: { military: 62, border: 10, terrorism:  8, cyber: 16, human:  4 }, notableQuote: 'Those who have not lived next to authoritarian imperialism may theorise about engagement. We prefer deterrence.' },
  { id: 13, name: 'María García Ruiz',  country: 'Spain',      party: 'S&D',       periods: ['7th','8th','9th'],  totalSpeeches: 1150, securitySpeeches: 138, securityPct: 12, dominantFrame: 'terrorism',sentimentScore: -0.14, frameBreakdown: { military: 10, border: 18, terrorism: 48, cyber: 12, human: 12 }, notableQuote: 'Spain has spent thirty years confronting terrorism at home while some colleagues still treated it as an abstraction. We know what it costs. We know what works.' },
  { id: 14, name: 'Patrick O\'Donnell', country: 'Ireland',    party: 'Greens/EFA',periods: ['9th','10th'],       totalSpeeches:  440, securitySpeeches:  18, securityPct:  4, dominantFrame: 'human',    sentimentScore: -0.20, frameBreakdown: { military:  6, border: 12, terrorism:  8, cyber: 14, human: 60 }, notableQuote: 'Ireland\'s military neutrality is not naïvety — it is a principled foreign policy tradition that has served peace and humanitarian engagement for generations.' },
  { id: 15, name: 'Anke Brunnemann',    country: 'Germany',    party: 'The Left',  periods: ['8th','9th'],        totalSpeeches:  680, securitySpeeches:  41, securityPct:  6, dominantFrame: 'human',    sentimentScore: -0.28, frameBreakdown: { military:  4, border: 10, terrorism: 12, cyber: 18, human: 56 }, notableQuote: 'Every euro spent on Frontex is a euro not spent on development, on climate adaptation, on the conditions that produce displacement in the first place.' },
  { id: 16, name: 'Piotr Zawadzki',     country: 'Poland',     party: 'EPP',       periods: ['7th','8th','9th'],  totalSpeeches:  980, securitySpeeches: 167, securityPct: 17, dominantFrame: 'military', sentimentScore:  0.08, frameBreakdown: { military: 52, border: 20, terrorism: 12, cyber: 12, human:  4 }, notableQuote: 'PESCO without real capability targets is a press release. European defence integration needs binding commitments, not aspirational language.' },
  { id: 17, name: 'Lucia Bianchi',      country: 'Italy',      party: 'ID/PfE',    periods: ['9th','10th'],       totalSpeeches:  560, securitySpeeches: 112, securityPct: 20, dominantFrame: 'border',   sentimentScore:  0.20, frameBreakdown: { military: 10, border: 68, terrorism: 14, cyber:  4, human:  4 }, notableQuote: 'Italy receives the boats, while others lecture us on solidarity. Our government has a mandate from the Italian people to protect our coasts.' },
  { id: 18, name: 'Dieter Schwarzmann', country: 'Germany',    party: 'EPP',       periods: ['6th','7th','8th'],  totalSpeeches: 1420, securitySpeeches: 156, securityPct: 11, dominantFrame: 'cyber',    sentimentScore:  0.02, frameBreakdown: { military: 16, border: 12, terrorism: 18, cyber: 40, human: 14 }, notableQuote: 'The EU\'s cybersecurity regulation framework is necessary but not sufficient. Mandatory incident reporting without consequence is bureaucracy, not security.' },
  { id: 19, name: 'Ana Costa Ferreira', country: 'Portugal',   party: 'S&D',       periods: ['8th','9th','10th'], totalSpeeches:  720, securitySpeeches:  50, securityPct:  7, dominantFrame: 'human',    sentimentScore: -0.16, frameBreakdown: { military:  8, border: 16, terrorism: 10, cyber: 12, human: 54 }, notableQuote: 'Portugal has always understood the Atlantic as a space of connection, not separation. European security must include the dimension of the south.' },
  { id: 20, name: 'Karolína Blahová',   country: 'Slovakia',   party: 'ECR',       periods: ['9th','10th'],       totalSpeeches:  480, securitySpeeches:  62, securityPct: 13, dominantFrame: 'terrorism',sentimentScore:  0.04, frameBreakdown: { military: 20, border: 22, terrorism: 40, cyber: 12, human:  6 }, notableQuote: 'Central Europe is not a buffer zone for Western security priorities. We are full members of this Union and our threat perceptions deserve equal respect.' },
  { id: 21, name: 'Marta Kowalczyk',    country: 'Poland',     party: 'S&D',       periods: ['9th','10th'],       totalSpeeches:  540, securitySpeeches:  81, securityPct: 15, dominantFrame: 'military', sentimentScore: -0.05, frameBreakdown: { military: 44, border: 14, terrorism: 12, cyber: 18, human: 12 }, notableQuote: 'Poland\'s commitment to collective defence comes with a reciprocal expectation: that the Union will not be selective in its solidarity.' },
  { id: 22, name: 'Héctor Vázquez Mora',country: 'Spain',      party: 'Renew',     periods: ['8th','9th'],        totalSpeeches:  660, securitySpeeches:  66, securityPct: 10, dominantFrame: 'cyber',    sentimentScore:  0.01, frameBreakdown: { military: 14, border: 16, terrorism: 24, cyber: 34, human: 12 }, notableQuote: 'Disinformation is the cheapest weapon in the hybrid arsenal. State-sponsored influence operations have a cost-effectiveness ratio that no conventional weapon can match.' },
  { id: 23, name: 'Theodora Alexiou',   country: 'Greece',     party: 'The Left',  periods: ['8th','9th','10th'], totalSpeeches:  590, securitySpeeches:  35, securityPct:  6, dominantFrame: 'human',    sentimentScore: -0.30, frameBreakdown: { military:  4, border: 14, terrorism:  8, cyber:  8, human: 66 }, notableQuote: 'The EU pays Turkey billions to keep refugees out and calls it a security arrangement. I call it the outsourcing of our human rights obligations.' },
  { id: 24, name: 'Berndt Johansson',   country: 'Sweden',     party: 'S&D',       periods: ['7th','8th','9th'],  totalSpeeches:  840, securitySpeeches:  76, securityPct:  9, dominantFrame: 'cyber',    sentimentScore: -0.04, frameBreakdown: { military: 18, border:  8, terrorism: 14, cyber: 42, human: 18 }, notableQuote: 'Sweden\'s experience with hybrid warfare since 2014 has shaped our view of security comprehensively. Physical and digital defence are inseparable.' },
  { id: 25, name: 'Florentina Ionescu', country: 'Romania',    party: 'EPP',       periods: ['9th','10th'],       totalSpeeches:  500, securitySpeeches:  55, securityPct: 11, dominantFrame: 'border',   sentimentScore:  0.03, frameBreakdown: { military: 24, border: 36, terrorism: 14, cyber: 16, human: 10 }, notableQuote: 'Romania guards the EU\'s eastern border. What happens in Odessa does not stay in Odessa. We ask our partners to see the Black Sea as a European sea.' },
  { id: 26, name: 'Anne-Sophie Petit',  country: 'France',     party: 'ID/PfE',    periods: ['9th','10th'],       totalSpeeches:  430, securitySpeeches:  95, securityPct: 22, dominantFrame: 'border',   sentimentScore:  0.22, frameBreakdown: { military: 10, border: 60, terrorism: 20, cyber:  4, human:  6 }, notableQuote: 'The Commission\'s migration management framework has failed. The numbers speak for themselves. National governments must recover control of who enters their territory.' },
  { id: 27, name: 'Juhan Tamm',         country: 'Estonia',    party: 'Renew',     periods: ['8th','9th','10th'], totalSpeeches:  360, securitySpeeches:  79, securityPct: 22, dominantFrame: 'cyber',    sentimentScore: -0.02, frameBreakdown: { military: 28, border:  6, terrorism:  8, cyber: 52, human:  6 }, notableQuote: 'Estonia built a digital state precisely because we understood that the 21st century battleground would be digital. We share this experience freely — Europe must learn fast.' },
  { id: 28, name: 'Dorota Wieczorek',   country: 'Poland',     party: 'ECR',       periods: ['8th','9th'],        totalSpeeches:  620, securitySpeeches: 130, securityPct: 21, dominantFrame: 'military', sentimentScore:  0.12, frameBreakdown: { military: 56, border: 18, terrorism:  8, cyber: 14, human:  4 }, notableQuote: 'Every PESCO project delayed is a message to Moscow that European defence integration is optional. It is not optional.' },
  { id: 29, name: 'Marco Rinaldi',      country: 'Italy',      party: 'EPP',       periods: ['7th','8th','9th'],  totalSpeeches: 1090, securitySpeeches: 120, securityPct: 11, dominantFrame: 'terrorism',sentimentScore:  0.05, frameBreakdown: { military: 18, border: 24, terrorism: 36, cyber: 14, human:  8 }, notableQuote: 'Italy\'s approach to counter-terrorism combines intelligence excellence with community policing. The radicalisation pathway must be interrupted long before it reaches violence.' },
  { id: 30, name: 'Karin Svensson',     country: 'Sweden',     party: 'Greens/EFA',periods: ['8th','9th','10th'], totalSpeeches:  610, securitySpeeches:  43, securityPct:  7, dominantFrame: 'human',    sentimentScore: -0.19, frameBreakdown: { military:  8, border:  8, terrorism:  6, cyber: 18, human: 60 }, notableQuote: 'The IPCC has called climate change the greatest threat to human security. Our security committees are still largely populated by those who think only in terms of uniformed adversaries.' },
  { id: 31, name: 'Claus Bredemann',    country: 'Germany',    party: 'S&D',       periods: ['9th','10th'],       totalSpeeches:  460, securitySpeeches:  37, securityPct:  8, dominantFrame: 'cyber',    sentimentScore: -0.06, frameBreakdown: { military: 12, border: 10, terrorism: 14, cyber: 44, human: 20 }, notableQuote: 'The NIS2 Directive is a step forward but our critical infrastructure operators are still learning what compliance means in practice. The threat clock does not pause for implementation.' },
  { id: 32, name: 'Nikoletta Papadaki', country: 'Greece',     party: 'EPP',       periods: ['7th','8th','9th'],  totalSpeeches:  870, securitySpeeches: 104, securityPct: 12, dominantFrame: 'border',   sentimentScore:  0.01, frameBreakdown: { military: 14, border: 46, terrorism: 16, cyber: 10, human: 14 }, notableQuote: 'Frontex\'s mandate expansion must come with proportionate parliamentary oversight. Operational effectiveness and fundamental rights accountability are not in conflict.' },
  { id: 33, name: 'Gabriela Molnár',    country: 'Hungary',    party: 'ID/PfE',    periods: ['9th','10th'],       totalSpeeches:  390, securitySpeeches:  86, securityPct: 22, dominantFrame: 'border',   sentimentScore:  0.25, frameBreakdown: { military:  8, border: 65, terrorism: 18, cyber:  4, human:  5 }, notableQuote: 'Hungary\'s border fence stopped irregular crossings. The statistics are there for those who wish to look. We do not apologise for protecting our nation.' },
  { id: 34, name: 'François Lecomte',   country: 'France',     party: 'EPP',       periods: ['6th','7th','8th'],  totalSpeeches: 1380, securitySpeeches: 193, securityPct: 14, dominantFrame: 'military', sentimentScore:  0.08, frameBreakdown: { military: 44, border: 14, terrorism: 20, cyber: 14, human:  8 }, notableQuote: 'European strategic autonomy must be built from capability, not from declaration. We need a European defence industrial base that can sustain a prolonged conflict.' },
  { id: 35, name: 'Lieselotte van Berg', country: 'Netherlands',party: 'Renew',     periods: ['8th','9th','10th'], totalSpeeches:  700, securitySpeeches:  77, securityPct: 11, dominantFrame: 'cyber',    sentimentScore:  0.00, frameBreakdown: { military: 14, border: 12, terrorism: 16, cyber: 42, human: 16 }, notableQuote: 'The Dutch approach to cybersecurity demonstrates that active defence and legal certainty are compatible. What we need now is European harmonisation of standards and response protocols.' },
  { id: 36, name: 'Václav Hrubý',       country: 'Czech Rep.', party: 'EPP',       periods: ['9th','10th'],       totalSpeeches:  490, securitySpeeches:  59, securityPct: 12, dominantFrame: 'military', sentimentScore:  0.07, frameBreakdown: { military: 40, border: 16, terrorism: 18, cyber: 18, human:  8 }, notableQuote: 'The Czech experience of Soviet occupation means we understand intuitively what strategic dependence costs. Energy diversification is a security imperative, not an economic preference.' },
  { id: 37, name: 'Miriam Schulte',     country: 'Germany',    party: 'Greens/EFA',periods: ['9th','10th'],       totalSpeeches:  420, securitySpeeches:  29, securityPct:  7, dominantFrame: 'human',    sentimentScore: -0.22, frameBreakdown: { military:  6, border:  8, terrorism:  6, cyber: 20, human: 60 }, notableQuote: 'We are securitising everything — migration, climate, health, trade. When everything becomes a security issue, we risk militarising our policy responses to fundamentally political problems.' },
  { id: 38, name: 'Raimonds Bergmanis', country: 'Latvia',     party: 'EPP',       periods: ['8th','9th','10th'], totalSpeeches:  410, securitySpeeches:  82, securityPct: 20, dominantFrame: 'military', sentimentScore:  0.16, frameBreakdown: { military: 60, border: 10, terrorism:  6, cyber: 20, human:  4 }, notableQuote: 'Latvia remembers 1940. The historical memory of our nation shapes our security posture in ways that do not always translate easily across the Council table.' },
  { id: 39, name: 'Elisa Conti',        country: 'Italy',      party: 'The Left',  periods: ['9th','10th'],       totalSpeeches:  380, securitySpeeches:  23, securityPct:  6, dominantFrame: 'human',    sentimentScore: -0.26, frameBreakdown: { military:  4, border: 12, terrorism:  8, cyber: 10, human: 66 }, notableQuote: 'The European Parliament approved a record defence budget while simultaneously cutting development aid. This tells you everything about our hierarchy of security priorities.' },
  { id: 40, name: 'Wojciech Kalinowski',country: 'Poland',     party: 'Renew',     periods: ['9th','10th'],       totalSpeeches:  510, securitySpeeches:  87, securityPct: 17, dominantFrame: 'military', sentimentScore:  0.11, frameBreakdown: { military: 48, border: 14, terrorism: 10, cyber: 20, human:  8 }, notableQuote: 'Poland\'s support for Ukraine is not only moral solidarity — it is forward defence of EU territory. The front line is where our security begins.' },
]

// ─── Frame definitions (13-frame classification system) ──────────────────────

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

// ─── Top-1 dominant frame shares by year (2019–2026) ─────────────────────────
// Source: frames_classified_para_ML_frame_shares_by_year.csv
// Values are percentages; n = paragraph count for that year

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
// A paragraph can be flagged for multiple frames simultaneously

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

// ─── BERTopic clusters (ML model, Step 02) ───────────────────────────────────
// Top clusters by document count; Topic -1 (outliers) and Topic 16 (Maltese)
// excluded. Used to validate and refine security frames inductively.

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

// Word cloud data: [term, cluster_count, frame_id]
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
