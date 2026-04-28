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

const GRID  = '#e5e7eb'
const TICK  = { fill: '#9ca3af', fontSize: 11 }
const ALINE = { stroke: '#e5e7eb' }

function robustColor(v) {
  if (v >= 0.85) return '#16a34a'
  if (v >= 0.70) return '#65a30d'
  if (v >= 0.50) return '#d97706'
  if (v >= 0)    return '#dc2626'
  return '#7c3aed'
}

function RobustCell({ v }) {
  return (
    <td className="text-center py-1.5 px-2">
      <span className="text-xs font-mono font-semibold" style={{ color: robustColor(v) }}>
        {v < 0 ? v.toFixed(3) : v.toFixed(2)}
      </span>
    </td>
  )
}

function FrameCard({ frame, expanded, onToggle }) {
  const def = FRAME_DEFINITIONS[frame.id] || ''
  const lit = FRAME_LITERATURE[frame.id] || ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 border-l-4 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      style={{ borderLeftColor: frame.color }}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">{frame.label}</span>
        {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-700 leading-relaxed">{def}</p>
          <p className="text-[10px] text-gray-400 italic">{lit}</p>
        </div>
      )}
    </motion.div>
  )
}

function Top1Tooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const sorted = [...payload].sort((a, b) => b.value - a.value).filter(p => p.value > 0.1)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg min-w-[180px]">
      <div className="font-semibold text-slate-900 mb-2">{label}</div>
      {sorted.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
            {FRAME_MAP[p.dataKey]?.shortLabel ?? p.dataKey}
          </span>
          <span className="font-mono text-slate-900">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

const PHASES = [
  {
    label: 'Pre-2020',
    color: '#f97316',
    title: 'Migration and defence prominence',
    body: 'Border and migration security peaks in 2019 at around 14 percent of top-ranked frames. Military defence is also elevated, partly driven by 9th term debates on Permanent Structured Cooperation (PESCO) and the European Defence Fund.',
  },
  {
    label: '2020–2021',
    color: '#0d9488',
    title: 'Pandemic-driven health securitisation',
    body: 'Health security spikes to 5 to 6 percent of top-ranked frames in 2020 and 2021, driven entirely by COVID-19. Border and migration security declines as the pandemic dominates the agenda.',
  },
  {
    label: '2022 onward',
    color: '#ef4444',
    title: 'War-driven military, energy and hybrid threats',
    body: "Russia's invasion produces sharp increases in military defence (from 12 to 19 percent by 2025) and energy security (from 8 to 15 percent). Foreign information interference grows steadily toward the 2024 European Parliament elections.",
  },
]

const KEY_TRENDS = [
  {
    id: 'economic',
    headline: 'Dominant and stable (roughly 43 to 46 percent)',
    detail: 'Economic security is the most consistently invoked frame, driven by sanctions, trade coercion, and supply chain vulnerabilities, reinforced further during COVID and after the Ukraine invasion.',
  },
  {
    id: 'military_defence',
    headline: 'Dips 2020–21, surges from 2022',
    detail: 'Military defence rises in 2019 amid Permanent Structured Cooperation and European Defence Fund debates, dips during the pandemic, then recovers sharply to around 19 percent by 2025 following the invasion of Ukraine.',
  },
  {
    id: 'energy',
    headline: 'Sharp increase from 2022, remains elevated',
    detail: 'Energy security nearly doubles from around 8 percent before 2022 to around 14 percent by 2026, driven by European gas dependency and the post-invasion energy crisis.',
  },
  {
    id: 'health',
    headline: 'COVID spike 2020–21, then rapid decline',
    detail: 'Health security rises to 5 to 6 percent of top-ranked frames in 2020 and 2021, then falls back below 1 percent as COVID recedes from the security agenda.',
  },
  {
    id: 'border_migration',
    headline: 'Gradual decline (from 14 to 10 percent)',
    detail: 'Border and migration security loses relative salience as the agenda shifts to the pandemic and then the Ukraine war, but remains a persistent baseline concern.',
  },
  {
    id: 'foreign_information_interference',
    headline: 'Low before 2022, rises toward 2024',
    detail: 'Foreign information interference grows steadily from near-zero to 1.3 percent by 2024, driven by Russian disinformation, hybrid threat institutionalisation, and European Parliament election concerns.',
  },
]

const ML_LINES = ['economic', 'border_migration', 'terrorism', 'energy', 'military_defence']

export default function SecurityFrames() {
  const [chartTab, setChartTab] = useState('top1')
  const [expandedFrame, setExpandedFrame] = useState(null)

  return (
    <PT>

      {/* Header + stats: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <PageHeader
            title="Security Frame Classification"
            subtitle="Zero-shot natural language inference classification on source-language paragraphs across all 24 EU languages. Multi-label: a paragraph can carry multiple frames simultaneously. Confidence threshold 0.4; main unit of analysis is the paragraph."
            icon={Shield}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="19,859"    label="Speeches classified"                  color="text-blue-600"    delay={0}    />
            <StatCard value="78,041"    label="Paragraphs classified"                color="text-amber-600"   delay={0.05} />
            <StatCard value="13"        label="Security frames"                      color="text-emerald-600" delay={0.1}  />
            <StatCard value="2019–2026" label="Period covered (9th and 10th terms)"  color="text-purple-600"  delay={0.15} />
          </div>
        </div>
      </div>

      {/* Main chart: gray */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <ChartCard
            title="Security Frame Distribution by Year"
            description={
              chartTab === 'top1'
                ? 'Stacked bars show the dominant frame per paragraph as a share of all classified paragraphs — values sum to roughly 100 percent per year. Note: 2019 (n=560) and 2020 (n=368) are small-sample years.'
                : 'Lines show the share of paragraphs flagged for each of the five largest frames under multi-label classification (threshold 0.4). A paragraph can appear in multiple frames simultaneously — values do not sum to 100 percent.'
            }
            animationDelay={0.1}
          >
            <div className="flex gap-2 mb-4">
              {[
                { key: 'top1',       label: 'Top-1 dominance' },
                { key: 'multilabel', label: 'Multi-label prevalence (top 5)' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setChartTab(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    chartTab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-800'
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
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                    <XAxis dataKey="year" tick={TICK} tickLine={false} axisLine={ALINE} />
                    <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                    <Tooltip content={<Top1Tooltip />} />
                    {FRAMES.map(f => <Bar key={f.id} dataKey={f.id} name={f.label} stackId="1" fill={f.color} />)}
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {FRAMES.map(f => (
                    <div key={f.id} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color }} />
                      <span className="text-[11px] text-gray-500">{f.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {chartTab === 'multilabel' && (
              <>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={MULTILABEL_YEARLY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                    <XAxis dataKey="year" tick={TICK} tickLine={false} axisLine={ALINE} />
                    <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    {ML_LINES.map(id => {
                      const f = FRAME_MAP[id]
                      return <Line key={id} type="monotone" dataKey={id} name={f?.label} stroke={f?.color} strokeWidth={2} dot={{ r: 3, fill: f?.color }} activeDot={{ r: 5 }} />
                    })}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {ML_LINES.map(id => {
                    const f = FRAME_MAP[id]
                    return (
                      <div key={id} className="flex items-center gap-1.5">
                        <span className="w-5 h-0.5 shrink-0" style={{ background: f?.color }} />
                        <span className="text-[11px] text-gray-500">{f?.label}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Three Phases: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Context</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Three Phases of European Parliament Security Discourse</h2>
          <p className="text-xs text-gray-500 mb-5">Overall pattern identified from the dominant frame time series, 2019–2026.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PHASES.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1 }}
                className="bg-white border border-gray-200 border-l-4 rounded-xl p-5" style={{ borderLeftColor: p.color }}>
                <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: p.color }}>{p.label}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Trajectories: gray */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Trajectories</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Key Frame Trajectories</h2>
          <p className="text-xs text-gray-500 mb-5">Based on dominant frame shares per year.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {KEY_TRENDS.map((t, i) => {
              const f = FRAME_MAP[t.id]
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  className="bg-white border border-gray-200 border-l-4 rounded-xl p-4" style={{ borderLeftColor: f?.color }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: f?.color }} />
                    <span className="text-xs font-bold text-slate-900">{f?.label}</span>
                  </div>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: f?.color }}>{t.headline}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.detail}</p>
                </motion.div>
              )
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 italic">
            Limitation: corpus covers the 9th and 10th parliamentary terms (2019–2026) only. 2019 (n=560) and 2020 (n=368) are small-sample years due to partial-year coverage and COVID session disruptions.
          </p>
        </div>
      </div>

      {/* Frame Definitions: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Definitions</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Frame Definitions</h2>
          <p className="text-xs text-gray-500 mb-5">
            Grounded in Entman (1993), Buzan, Wæver and de Wilde (1998), Hansen and Nissenbaum (2009), and EU-specific security literature.
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
      </div>

      {/* Methodology: gray */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Methodology</p>
            <h2 className="text-base font-bold text-slate-900 mb-4">Classification Methodology</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-gray-600">
              {[
                { label: 'Model', text: 'mDeBERTa-v3-mnli-xnli, a zero-shot natural language inference classifier covering all 24 EU languages in a single checkpoint, enabling classification on source-language text without prior translation.' },
                { label: 'Unit of analysis', text: 'Paragraph (blank-line delimited per transcript, minimum 450 characters). If a paragraph is below the threshold, it is merged with the next. Validated by robustness check against context-window units.' },
                { label: 'Threshold and multi-label', text: 'Confidence threshold = 0.4 (lower bound of the empirical score distribution). Frames are not mutually exclusive: 68 percent of paragraphs receive two or more frame labels at threshold 0.5, consistent with securitisation theory.' },
                { label: 'Non-security category', text: 'Paragraphs below threshold for all security frames are assigned to "Institutional / Procedural". 20 percent of paragraphs fall in this category, confirming the model captures substantive security framing.' },
                { label: 'Frame design', text: '13 frames derived from the Buzan et al. (1998) five-sector framework, expanded using inductive BERTopic clusters and validated against EU security communication (ProtectEU COM(2025); Security Union COM(2020)605).' },
                { label: 'Corpus', text: '19,859 speeches pre-filtered for security language; 78,041 paragraphs. 9th and 10th parliamentary terms (July 2019 to early 2026). 24 EU languages; Maltese-dominated speeches excluded from the English translation robustness check.' },
              ].map(({ label, text }) => (
                <div key={label}>
                  <div className="text-slate-900 font-semibold mb-1">{label}</div>
                  <p className="leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Robustness Checks: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Robustness</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Robustness Checks</h2>
          <p className="text-xs text-gray-500 mb-5">
            Two independent identification checks: (1) translation — does the distribution change if the 8 percent non-English speeches are translated and classified in English? (2) granularity — does the distribution change if the unit is a 5-sentence context window instead of a paragraph?
          </p>

          <div className="card p-5 mb-6 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-900 mb-3">Pearson correlations between specifications (multi-label and top-1 year-level shares)</div>
            <div className="flex flex-wrap gap-3 mb-3 text-[10px] text-gray-500">
              {[['≥0.85','#16a34a','Robust'],['0.70–0.84','#65a30d','Substantively robust'],['0.50–0.69','#d97706','Inspect'],['<0.50','#dc2626','Not robust'],['<0','#7c3aed','Negative']].map(([label, color, desc]) => (
                <span key={label} className="flex items-center gap-1">
                  <span className="font-mono font-bold" style={{ color }}>{label}</span>
                  <span className="text-gray-400">{desc}</span>
                </span>
              ))}
            </div>
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-normal">Frame</th>
                  <th className="text-center py-2 px-2 font-normal">Multilingual vs English<br /><span className="text-[9px] normal-case">multi-label</span></th>
                  <th className="text-center py-2 px-2 font-normal">Para vs Window<br /><span className="text-[9px] normal-case">multi-label</span></th>
                  <th className="text-center py-2 px-2 font-normal">Multilingual vs English<br /><span className="text-[9px] normal-case">top-1</span></th>
                  <th className="text-center py-2 px-2 font-normal">Para vs Window<br /><span className="text-[9px] normal-case">top-1</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ROBUSTNESS_TABLE.map(row => {
                  const f = FRAME_MAP[row.frame]
                  return (
                    <tr key={row.frame} className="hover:bg-gray-50">
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f?.color ?? '#94a3b8' }} />
                          <span className="text-gray-700">{f?.label ?? row.frame}</span>
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
            <p className="text-[10px] text-gray-400 mt-3 italic leading-relaxed">
              Key finding: multi-label correlations are consistently higher than top-1. Top-1 for terrorism and military defence shows lower multilingual versus English stability, indicating these frames are sensitive to linguistic nuance. Multi-label at paragraph level is the preferred and reported specification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold text-slate-800 mb-3">Top-1: Multilingual vs English translation</p>
              <img src="/ep-security-debates/robustness/robustness_top1_translation.png" alt="Top-1 multilingual vs English robustness" className="w-full rounded" />
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-slate-800 mb-3">Top-1: Paragraph vs Context Window</p>
              <img src="/ep-security-debates/robustness/robustness_top1_granularity.png" alt="Top-1 paragraph vs window robustness" className="w-full rounded" />
            </div>
            <div className="card p-4 md:col-span-2">
              <p className="text-xs font-semibold text-slate-800 mb-3">Multi-label: Paragraph vs Context Window</p>
              <img src="/ep-security-debates/robustness/robustness_multilabel_granularity.png" alt="Multi-label paragraph vs window robustness" className="w-full rounded" />
            </div>
          </div>
        </div>
      </div>

    </PT>
  )
}
