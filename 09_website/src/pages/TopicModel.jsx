import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { TOPICS, TOPIC_HEATMAP, PERIODS } from '../data/placeholder'
import { PageHeader, PlaceholderBadge, StatCard } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

function heatColor(v) {
  if (v >= 75) return '#ef4444'
  if (v >= 60) return '#f97316'
  if (v >= 45) return '#eab308'
  if (v >= 30) return '#3b82f6'
  if (v >= 15) return '#1e40af'
  return '#1e293b'
}

export default function TopicModel() {
  const [selected, setSelected] = useState(null)
  const topic = selected != null ? TOPICS[selected] : null
  const heatRow = selected != null ? TOPIC_HEATMAP[selected] : null

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Topic Modeling"
          subtitle="LDA model (K=20) fitted on the full corpus. Each cell in the heatmap shows relative topic salience (0–100) per EP legislative period. Click a row to inspect topic terms."
          icon={Layers}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value="20"      label="LDA topics"           color="text-blue-400"    delay={0}    />
          <StatCard value="7"       label="EP periods covered"   color="text-amber-400"   delay={0.05} />
          <StatCard value="0.54"    label="Coherence score (Cv)" color="text-emerald-400" delay={0.1}  />
          <StatCard value="487k"    label="Documents in corpus"  color="text-purple-400"  delay={0.15} />
        </div>

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 mb-6 overflow-x-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Topic Salience Heatmap by EP Period</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any row to view topic terms. Colour = relative salience index (0–100).</p>
            </div>
            <PlaceholderBadge />
          </div>
          <table className="w-full text-xs border-separate border-spacing-0.5 min-w-[580px]">
            <thead>
              <tr>
                <th className="text-left text-slate-500 font-normal pb-2 pr-3 w-44">Topic</th>
                {PERIODS.map(p => (
                  <th key={p.id} className="text-center text-slate-500 font-normal pb-2 px-1 whitespace-nowrap">{p.label.split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOPIC_HEATMAP.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className={`cursor-pointer transition-opacity ${selected != null && selected !== i ? 'opacity-40' : 'opacity-100'}`}
                >
                  <td className={`py-1 pr-3 text-xs font-medium leading-tight ${selected === i ? 'text-blue-300' : 'text-slate-400'}`}>
                    {TOPICS[i].label}
                  </td>
                  {row.v.map((val, j) => (
                    <td key={j} className="text-center py-0.5 px-0.5">
                      <div
                        className="rounded text-[9px] font-bold text-white/80 w-full h-6 flex items-center justify-center"
                        style={{ background: heatColor(val) }}
                      >
                        {val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-[10px] text-slate-600">Salience index:</span>
            {[['≥75', '#ef4444'], ['60–74', '#f97316'], ['45–59', '#eab308'], ['30–44', '#3b82f6'], ['15–29', '#1e40af'], ['<15', '#1e293b']].map(([lbl, col]) => (
              <div key={lbl} className="flex items-center gap-1">
                <span className="w-4 h-3 rounded" style={{ background: col, display: 'inline-block' }} />
                <span className="text-[10px] text-slate-500">{lbl}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Topic detail */}
        {topic && heatRow && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 border-blue-700/40">
            <h3 className="text-sm font-bold text-blue-300 mb-1">Topic {selected + 1}: {topic.label}</h3>
            <p className="text-xs text-slate-500 mb-3">Top terms from the β matrix (highest probability words for this topic)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {topic.terms.map((t, i) => (
                <span key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ background: `rgba(59,130,246,${0.9 - i * 0.07})` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-end gap-1">
              {heatRow.v.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-sm" style={{ height: `${val * 0.8}px`, background: heatColor(val), minHeight: 4 }} />
                  <span className="text-[9px] text-slate-500">{PERIODS[i].label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!topic && (
          <div className="text-center text-xs text-slate-600 py-6">← Click a row in the heatmap to inspect topic terms and period trajectory</div>
        )}
      </div>
    </PT>
  )
}
