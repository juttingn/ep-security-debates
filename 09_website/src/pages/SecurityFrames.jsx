import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { FRAMES, TOP1_YEARLY, MULTILABEL_YEARLY, FRAME_DEFINITIONS, FRAME_LITERATURE, ROBUSTNESS_TABLE } from '../data/placeholder'
import { PageHeader, StatCard, ChartCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const FRAME_MAP = Object.fromEntries(FRAMES.map(f => [f.id, f]))

function robustColor(v) {
  if (v >= 0.85) return '#22c55e'
  if (v >= 0.70) return '#84cc16'
  if (v >= 0.50) return '#f59e0b'
  if (v >= 0)    return '#ef4444'
  return '#7c3aed'
}

function RobustCell({ v }) {
  const label = v < 0 ? v.toFixed(3) : v.toFixed(2)
  return (
    <td className="text-center py-1 px-2">
      <span className="text-xs font-mono font-semibold" style={{ color: robustColor(v) }}>{label}</span>
    </td>
  )
}

function FrameCard({ frame, expanded, onToggle }) {
  const def = FRAME_DEFINITIONS[frame.id] || ''
  const lit = FRAME_LITERATURE[frame.id] || ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="card p-4 border-l-2 cursor-pointer hover:bg-slate-800/50 transition-colors"
      style={{ borderLeftColor: frame.color }}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{frame.label}</span>
        {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">{def}</p>
          <p className="text-[10px] text-slate-500 italic">{lit}</p>
        </div>
      )}
    </motion.div>
  )
}

// Custom tooltip for stacked bar
function Top1Tooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const sorted = [...payload].sort((a, b) => b.value - a.value).filter(p => p.value > 0.1)
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-xl min-w-[180px]">
      <div className="font-semibold text-white mb-2">{label}</div>
      {sorted.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
            {FRAME_MAP[p.dataKey]?.shortLabel ?? p.dataKey}
          </span>
          <span className="font-mono text-white">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

// Phases summary
const PHASES = [
  {
    label: 'Pre-2020',
    color: '#f97316',
    title: 'Migration & defence prominence',
    body: 'Border/migration peaks in 2019 (~14% top-1). Military defence also elevated, partly driven by EP9 debates on PESCO and European Defence Fund.',
  },
  {
    label: '2020–2021',
    color: '#14b8a6',
    title: 'Pandemic-driven health securitisation',
    body: 'Health security spikes to 5–6% of top-1 frames in 2020–21, driven entirely by COVID-19. Border/migration declines as the pandemic dominates the agenda.',
  },
  {
    label: '2022 onward',
    color: '#ef4444',
    title: 'War-driven military, energy & hybrid threats',
    body: "Russia’s invasion produces sharp increases in military defence (12→19% by 2025) and energy security (8→15%). Foreign information interference grows steadily toward the 2024 EP elections.",
  },
]

// Key frame trends
const KEY_TRENDS = [
  { id: 'economic',     headline: 'Dominant and stable (≈43–46%)',     detail: "Economic security is the most consistently invoked frame — driven by sanctions, trade coercion, and supply chain vulnerabilities — reinforced further during COVID and after Russia's invasion." },
  { id: 'military_defence', headline: 'Dips 2020–21, surges from 2022', detail: "Military defence rises in 2019 (PESCO/EDF debates), dips during the pandemic, then recovers sharply to ~19% by 2025 following Russia's invasion of Ukraine." },
  { id: 'energy',       headline: 'Sharp increase 2022, remains elevated', detail: 'Energy security nearly doubles from ~8% (pre-2022) to ~14% by 2026, driven by European gas dependency and the post-invasion energy crisis.' },
  { id: 'health',       headline: 'COVID spike 2020–21, then rapid decline', detail: 'Health security rises to 5–6% of top-1 frames in 2020–21 and then falls back below 1% as COVID recedes from the security agenda.' },
  { id: 'border_migration', headline: 'Gradual decline (14%→10%)', detail: 'Border/migration loses relative salience as the agenda shifts to the pandemic and then the Ukraine war, but remains a persistent baseline concern.' },
  { id: 'foreign_information_interference', headline: 'Low pre-2022, rises toward 2024', detail: 'Foreign information interference grows steadily from near-zero to 1.3% by 2024 — driven by Russian disinformation, hybrid threat institutionalisation, and EP election concerns.' },
]

// Top 5 frames for multi-label line chart
const ML_LINES = ['economic', 'border_migration', 'terrorism', 'energy', 'military_defence']

export default function SecurityFrames() {
  const [chartTab, setChartTab] = useState('top1')
  const [expandedFrame, setExpandedFrame] = useState(null)

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <PageHeader
          title="Security Frame Classification"
          subtitle="Zero-shot NLI classification using mDeBERTa-v3-mnli-xnli on source-language paragraphs. Multi-label: a paragraph can carry multiple frames simultaneously. Threshold 0.4; main unit: paragraph."
          icon={Shield}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="19,859"    label="Speeches classified"       color="text-blue-400"    delay={0}    />
          <StatCard value="78,041"    label="Paragraphs (avg 3.9/speech)" color="text-amber-400"  delay={0.05} />
          <StatCard value="13"        label="Security frames"            color="text-emerald-400" delay={0.1}  />
          <StatCard value="2019–2026" label="Period covered (EP9–10)"   color="text-purple-400"  delay={0.15} />
        </div>

        {/* Main Chart */}
        <ChartCard
          placeholder={false}
          title="Security Frame Distribution by Year"
          description={
            chartTab === 'top1'
              ? 'Stacked bars show the dominant (Top-1) frame per paragraph as a share of all classified paragraphs — values sum to ~100% per year. Note: 2019 n=560 and 2020 n=368 are small-sample years.'
              : 'Lines show the share of paragraphs flagged for each of the 5 largest frames under multi-label classification (threshold 0.4). A paragraph can appear in multiple frames simultaneously — values do not sum to 100%.'
          }
          animationDelay={0.1}
        >
          {/* Tab toggle */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'top1',      label: 'Top-1 dominance' },
              { key: 'multilabel',label: 'Multi-label prevalence (top 5)' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setChartTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  chartTab === t.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {chartTab === 'top1' && (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={TOP1_YEARLY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<Top1Tooltip />} />
                  {FRAMES.map(f => (
                    <Bar key={f.id} dataKey={f.id} name={f.label} stackId="1" fill={f.color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {FRAMES.map(f => (
                  <div key={f.id} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color }} />
                    <span className="text-[11px] text-slate-400">{f.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {chartTab === 'multilabel' && (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={MULTILABEL_YEARLY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  {ML_LINES.map(id => {
                    const f = FRAME_MAP[id]
                    return (
                      <Line key={id} type="monotone" dataKey={id} name={f?.label} stroke={f?.color}
                        strokeWidth={2} dot={{ r: 3, fill: f?.color }} activeDot={{ r: 5 }} />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {ML_LINES.map(id => {
                  const f = FRAME_MAP[id]
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <span className="w-5 h-0.5 shrink-0" style={{ background: f?.color }} />
                      <span className="text-[11px] text-slate-400">{f?.label}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </ChartCard>

        {/* Three Phases */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Three Phases of EP Security Discourse</h2>
          <p className="text-xs text-slate-500 mb-4">Overall pattern identified from the top-1 dominant frame time series, 2019–2026.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PHASES.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1 }}
                className="card p-5 border-l-2" style={{ borderLeftColor: p.color }}>
                <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: p.color }}>{p.label}</span>
                <h3 className="text-sm font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frame-by-Frame Trends */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Key Frame Trajectories</h2>
          <p className="text-xs text-slate-500 mb-4">Based on top-1 dominant frame shares per year.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {KEY_TRENDS.map((t, i) => {
              const f = FRAME_MAP[t.id]
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  className="card p-4 border-l-2" style={{ borderLeftColor: f?.color }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: f?.color }} />
                    <span className="text-xs font-bold text-white">{f?.label}</span>
                  </div>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: f?.color }}>{t.headline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.detail}</p>
                </motion.div>
              )
            })}
          </div>
          <p className="text-[11px] text-slate-600 mt-3 italic">
            Limitation: corpus covers EP9–10 (2019–2026) only. 2019 n=560 and 2020 n=368 are small due to partial-year coverage (EP9 seated July 2019) and COVID session disruptions.
          </p>
        </div>

        {/* Frame Definitions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Frame Definitions</h2>
          <p className="text-xs text-slate-500 mb-4">
            Grounded in Entman (1993), Buzan, Wæver & de Wilde (1998), Hansen & Nissenbaum (2009), and EU-specific security literature.
            Derived inductively from BERTopic clusters and validated against securitisation theory. Click any card to expand.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FRAMES.map(f => (
              <FrameCard
                key={f.id}
                frame={f}
                expanded={expandedFrame === f.id}
                onToggle={() => setExpandedFrame(expandedFrame === f.id ? null : f.id)}
              />
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-white mb-4">Classification Methodology</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-slate-400">
            <div>
              <div className="text-slate-200 font-semibold mb-1">Model</div>
              <p className="leading-relaxed">mDeBERTa-v3-mnli-xnli — zero-shot NLI classifier covering all 24 EU languages in a single checkpoint, enabling classification on source-language text without prior translation.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Unit of analysis</div>
              <p className="leading-relaxed">Paragraph (blank-line delimited per EP transcript, min. 450 characters). If a paragraph is below the threshold, it is merged with the next. Validated by robustness check against context-window units.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Threshold & multi-label</div>
              <p className="leading-relaxed">Confidence threshold = 0.4 (lower bound of the empirical score distribution). Frames are not mutually exclusive — 68% of paragraphs receive 2+ frame labels at threshold 0.5, consistent with securitisation theory.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Non-security category</div>
              <p className="leading-relaxed">Paragraphs below threshold for all security frames are assigned "Institutional / Procedural". 20% of paragraphs fall in this category, confirming the model captures substantive security framing, not procedural discourse.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Frame design</div>
              <p className="leading-relaxed">13 frames derived from Buzan et al. (1998) five-sector framework, expanded using inductive BERTopic clusters (Step 2) and validated against EU security communication (ProtectEU COM(2025); Security Union COM(2020)605).</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Corpus</div>
              <p className="leading-relaxed">19,859 speeches pre-filtered for security language; 78,041 paragraphs. EP9–10 (July 2019 – early 2026). 24 EU languages; Maltese-dominated speeches excluded from the EN translation robustness check.</p>
            </div>
          </div>
        </div>

        {/* Robustness Checks */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Robustness Checks</h2>
          <p className="text-xs text-slate-500 mb-4">
            Two independent identification checks: (1) translation — does the distribution change if the 8% non-English speeches are translated and classified in English? (2) granularity — does the distribution change if the unit is a 5-sentence context window instead of a paragraph?
          </p>

          {/* Correlation table */}
          <div className="card p-4 mb-6 overflow-x-auto">
            <div className="text-xs font-semibold text-white mb-3">Pearson correlations between specifications (multi-label and top-1 year-level shares)</div>
            <div className="flex flex-wrap gap-3 mb-3 text-[10px] text-slate-500">
              {[['≥0.85', '#22c55e', 'Robust'], ['0.70–0.84', '#84cc16', 'Substantively robust'], ['0.50–0.69', '#f59e0b', 'Inspect'], ['<0.50', '#ef4444', 'Not robust'], ['<0', '#7c3aed', 'Negative']].map(([label, color, desc]) => (
                <span key={label} className="flex items-center gap-1">
                  <span className="font-mono font-bold" style={{ color }}>{label}</span>
                  <span className="text-slate-600">{desc}</span>
                </span>
              ))}
            </div>
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="text-left py-1.5 pr-4 font-normal">Frame</th>
                  <th className="text-center py-1.5 px-2 font-normal">ML vs EN<br /><span className="text-[9px] normal-case">multi-label</span></th>
                  <th className="text-center py-1.5 px-2 font-normal">Para vs Window<br /><span className="text-[9px] normal-case">multi-label</span></th>
                  <th className="text-center py-1.5 px-2 font-normal">ML vs EN<br /><span className="text-[9px] normal-case">top-1</span></th>
                  <th className="text-center py-1.5 px-2 font-normal">Para vs Window<br /><span className="text-[9px] normal-case">top-1</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ROBUSTNESS_TABLE.map(row => {
                  const f = FRAME_MAP[row.frame]
                  return (
                    <tr key={row.frame} className="hover:bg-slate-800/40">
                      <td className="py-1.5 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f?.color ?? '#94a3b8' }} />
                          <span className="text-slate-300">{f?.label ?? row.frame}</span>
                        </span>
                      </td>
                      <RobustCell v={row.ml_vs_en_multi} />
                      <RobustCell v={row.para_vs_window_multi} />
                      <RobustCell v={row.ml_vs_en_top1} />
                      <RobustCell v={row.para_vs_window_top1} />
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-600 mt-3 italic leading-relaxed">
              Key finding: multi-label correlations are consistently higher than top-1. Top-1 for terrorism and military_defence shows low ML vs EN stability, indicating these discursive frames are sensitive to linguistic nuance. Multi-label at paragraph level is the preferred and reported specification.
            </p>
          </div>

          {/* Robustness plots */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-300 mb-2">Top-1: Multilingual vs English translation</p>
              <img src="/robustness/robustness_top1_translation.png" alt="Top-1 ML vs EN robustness" className="w-full rounded" />
            </div>
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-300 mb-2">Top-1: Paragraph vs Context Window</p>
              <img src="/robustness/robustness_top1_granularity.png" alt="Top-1 paragraph vs window robustness" className="w-full rounded" />
            </div>
            <div className="card p-3 md:col-span-2">
              <p className="text-xs font-semibold text-slate-300 mb-2">Multi-label: Paragraph vs Context Window</p>
              <img src="/robustness/robustness_multilabel_granularity.png" alt="Multi-label paragraph vs window robustness" className="w-full rounded" />
            </div>
          </div>
        </div>

      </div>
    </PT>
  )
}
