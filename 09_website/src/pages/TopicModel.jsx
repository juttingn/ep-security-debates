import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { BERTOPIC_CLUSTERS, WORD_CLOUD_DATA, FRAMES } from '../data/placeholder'
import { PageHeader, StatCard } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const FRAME_MAP = Object.fromEntries(FRAMES.map(f => [f.id, f]))

const MIN_COUNT = 52
const MAX_COUNT = 1719

function termSize(count) {
  const t = (Math.log(count) - Math.log(MIN_COUNT)) / (Math.log(MAX_COUNT) - Math.log(MIN_COUNT))
  return (0.68 + t * 1.55).toFixed(2) + 'rem'
}

function WordCloud({ onSelectCluster, selectedCluster }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 leading-loose py-2">
      {WORD_CLOUD_DATA.map(([term, count, frameId], i) => {
        const f = FRAME_MAP[frameId]
        const cluster = BERTOPIC_CLUSTERS.find(c => c.frames.includes(frameId) && c.terms.some(t => term.includes(t.split(' ')[0])))
        const isSelected = selectedCluster !== null && cluster?.id === selectedCluster
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.008 }}
            onClick={() => cluster && onSelectCluster(isSelected ? null : cluster.id)}
            className="cursor-pointer transition-all select-none"
            style={{
              fontSize: termSize(count),
              color: f?.color ?? '#94a3b8',
              opacity: selectedCluster && !isSelected ? 0.3 : 1,
              fontWeight: count > 400 ? 700 : count > 200 ? 600 : 500,
              textShadow: isSelected ? `0 0 12px ${f?.color}88` : 'none',
            }}
            title={`Cluster: ${cluster?.label ?? frameId} (n=${count})\nFrame: ${f?.label}`}
          >
            {term}
          </motion.span>
        )
      })}
    </div>
  )
}

export default function TopicModel() {
  const [selectedClusterId, setSelectedClusterId] = useState(null)
  const selectedCluster = selectedClusterId != null
    ? BERTOPIC_CLUSTERS.find(c => c.id === selectedClusterId)
    : null

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <PageHeader
          title="Topic Clusters (BERTopic)"
          subtitle="Inductive topic discovery via BERTopic (sentence-transformer embeddings + HDBSCAN), run in both multilingual and English-translated variants. Used to validate and expand security frames from the literature — not for hypothesis formulation."
          icon={Layers}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="2"       label="Model variants (ML / EN)"     color="text-blue-400"    delay={0}    />
          <StatCard value="50+"     label="BERTopic clusters identified"  color="text-amber-400"   delay={0.05} />
          <StatCard value="19,859"  label="Speeches in the corpus"        color="text-emerald-400" delay={0.1}  />
          <StatCard value="Topic 16" label="Excluded — Maltese (distorts multilingual model)" color="text-red-400" delay={0.15} />
        </div>

        {/* Word cloud */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Security-Relevant BERTopic Terms</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Word size reflects cluster document count (larger = more speeches in that cluster).
                Colour indicates the security frame the cluster validates. Click a term to inspect its cluster.
              </p>
            </div>
          </div>

          <WordCloud onSelectCluster={setSelectedClusterId} selectedCluster={selectedClusterId} />

          {/* Frame colour legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-slate-800">
            {FRAMES.filter(f => f.id !== 'institutional_procedural').map(f => (
              <div key={f.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                <span className="text-[10px] text-slate-500">{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Selected cluster detail */}
        {selectedCluster ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 border-blue-700/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-300">
                Topic {selectedCluster.id}: {selectedCluster.label}
                <span className="ml-2 text-xs font-normal text-slate-500">{selectedCluster.count.toLocaleString()} speeches</span>
              </h3>
              <button onClick={() => setSelectedClusterId(null)} className="text-xs text-slate-600 hover:text-slate-400">✕ close</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Top representative terms from the BERTopic model</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCluster.terms.map((t, i) => {
                const f = FRAME_MAP[selectedCluster.frames[0]]
                return (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: `${f?.color ?? '#3b82f6'}${Math.round((0.9 - i * 0.07) * 255).toString(16).padStart(2,'0')}` }}>
                    {t}
                  </span>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCluster.frames.map(fid => {
                const f = FRAME_MAP[fid]
                return (
                  <span key={fid} className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full" style={{ background: f?.color }} />
                    → {f?.label}
                  </span>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-xs text-slate-600 py-4">← Click a term in the word cloud to inspect its BERTopic cluster</div>
        )}

        {/* Cluster table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-1">All Displayed Clusters</h3>
          <p className="text-xs text-slate-500 mb-4">Ordered by document count. Topic -1 (outliers) and Topic 16 (Maltese) excluded.</p>
          <table className="w-full text-xs min-w-[580px]">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-800">
                <th className="text-left py-2 pr-4 font-normal">ID</th>
                <th className="text-left py-2 pr-4 font-normal">Cluster label</th>
                <th className="text-right py-2 pr-4 font-normal">Speeches</th>
                <th className="text-left py-2 font-normal">Linked frame(s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {BERTOPIC_CLUSTERS.map(c => (
                <tr key={c.id}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${selectedClusterId === c.id ? 'bg-slate-800/60' : ''}`}
                  onClick={() => setSelectedClusterId(selectedClusterId === c.id ? null : c.id)}
                >
                  <td className="py-1.5 pr-4 text-slate-600 font-mono">{c.id}</td>
                  <td className="py-1.5 pr-4 text-slate-300">{c.label}</td>
                  <td className="py-1.5 pr-4 text-right text-slate-400 font-mono">{c.count.toLocaleString()}</td>
                  <td className="py-1.5">
                    <div className="flex flex-wrap gap-1">
                      {c.frames.map(fid => {
                        const f = FRAME_MAP[fid]
                        return (
                          <span key={fid} className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
                            style={{ background: f?.color ?? '#64748b' }}>
                            {f?.shortLabel ?? fid}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Methodology */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-white mb-4">How BERTopic Informed Frame Selection</h2>
          <div className="grid sm:grid-cols-2 gap-5 text-xs text-slate-400">
            <div>
              <div className="text-slate-200 font-semibold mb-1">Role in the pipeline</div>
              <p className="leading-relaxed">BERTopic was used inductively to <em className="text-slate-300">validate and expand</em> security frames from the literature — not for hypothesis formulation. The model became unstable when given more than 30 words per hypothesis, so it was kept at the cluster-discovery stage only.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Model details</div>
              <p className="leading-relaxed">Sentence-transformer embeddings → UMAP dimensionality reduction → HDBSCAN clustering → c-TF-IDF topic representation. Two variants: (a) English-translated speeches, (b) multilingual pooled speeches. ML variant is the main specification.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">What the clusters showed</div>
              <p className="leading-relaxed">The top 20 clusters are dominated by Defence/Military, Economic security, and Energy — broadly confirming the expected securitisation hierarchy in EP9–10. Smaller but distinct clusters validated the addition of Organised Crime, Food Security, Gender-Based Violence, and Foreign Information Interference as independent frames.</p>
            </div>
            <div>
              <div className="text-slate-200 font-semibold mb-1">Frame refinement examples</div>
              <ul className="leading-relaxed space-y-1 list-disc list-inside">
                <li>Topic 43 (crime_organised) → added Organised Crime as distinct political security risk</li>
                <li>Topics 3 & 12 (women_gender, iran_women) → added Gender-Based Violence</li>
                <li>Topic 7 (farmers_food_agriculture) → added Food Security</li>
                <li>Topics 9 & 17 (energy_gas) → separated Energy from broad Economic security</li>
                <li>Topics 20, 26, 47, 48 → split Cyber from Foreign Information Interference</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </PT>
  )
}
