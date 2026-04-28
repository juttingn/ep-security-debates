import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { BERTOPIC_CLUSTERS, WORD_CLOUD_DATA, FRAMES } from '../data/ep_data'
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
              color: f?.color ?? '#6b7280',
              opacity: selectedCluster !== null && !isSelected ? 0.25 : 1,
              fontWeight: count > 400 ? 700 : count > 200 ? 600 : 500,
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

      {/* Header + stats: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <PageHeader
            title="Topic Clusters (BERTopic)"
            subtitle="Inductive topic discovery via BERTopic (sentence-transformer embeddings combined with HDBSCAN clustering), run in both multilingual and English-translated variants. Used to validate and expand security frames from the literature, not for hypothesis formulation."
            icon={Layers}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="2"        label="Model variants (multilingual / English)"              color="text-blue-600"    delay={0}    />
            <StatCard value="50+"      label="BERTopic clusters identified"                          color="text-amber-600"   delay={0.05} />
            <StatCard value="19,859"   label="Speeches in the corpus"                               color="text-emerald-600" delay={0.1}  />
            <StatCard value="Topic 16" label="Excluded: Maltese (distorts multilingual model)"      color="text-red-600"     delay={0.15} />
          </div>
        </div>
      </div>

      {/* Word cloud + cluster detail: gray */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Security-Relevant BERTopic Terms</h3>
            <p className="text-xs text-gray-500 mb-4">
              Word size reflects cluster document count (larger = more speeches in that cluster).
              Colour indicates the security frame the cluster validates. Click a term to inspect its cluster.
            </p>
            <WordCloud onSelectCluster={setSelectedClusterId} selectedCluster={selectedClusterId} />
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100">
              {FRAMES.filter(f => f.id !== 'institutional_procedural').map(f => (
                <div key={f.id} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                  <span className="text-[10px] text-gray-500">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {selectedCluster ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-700">
                  Topic {selectedCluster.id}: {selectedCluster.label}
                  <span className="ml-2 text-xs font-normal text-gray-400">{selectedCluster.count.toLocaleString()} speeches</span>
                </h3>
                <button onClick={() => setSelectedClusterId(null)} className="text-xs text-gray-400 hover:text-gray-600">close</button>
              </div>
              <p className="text-xs text-gray-500 mb-3">Top representative terms from the BERTopic model</p>
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
                    <span key={fid} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full" style={{ background: f?.color }} />
                      {f?.label}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-xs text-gray-400 py-4">Click a term in the word cloud to inspect its BERTopic cluster</div>
          )}
        </div>
      </div>

      {/* Cluster table: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 overflow-x-auto">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">All Displayed Clusters</h3>
            <p className="text-xs text-gray-500 mb-4">Ordered by document count. Topic -1 (outliers) and Topic 16 (Maltese) excluded.</p>
            <table className="w-full text-xs min-w-[580px]">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-normal">ID</th>
                  <th className="text-left py-2 pr-4 font-normal">Cluster label</th>
                  <th className="text-right py-2 pr-4 font-normal">Speeches</th>
                  <th className="text-left py-2 font-normal">Linked frame(s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {BERTOPIC_CLUSTERS.map(c => (
                  <tr key={c.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedClusterId === c.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedClusterId(selectedClusterId === c.id ? null : c.id)}
                  >
                    <td className="py-1.5 pr-4 text-gray-400 font-mono">{c.id}</td>
                    <td className="py-1.5 pr-4 text-gray-700">{c.label}</td>
                    <td className="py-1.5 pr-4 text-right text-gray-500 font-mono">{c.count.toLocaleString()}</td>
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
        </div>
      </div>

      {/* Methodology: gray */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Methodology</p>
            <h2 className="text-base font-bold text-slate-900 mb-4">How BERTopic Informed Frame Selection</h2>
            <div className="grid sm:grid-cols-2 gap-5 text-xs text-gray-600">
              <div>
                <div className="text-slate-900 font-semibold mb-1">Role in the pipeline</div>
                <p className="leading-relaxed">BERTopic was used inductively to validate and expand security frames from the literature, not for hypothesis formulation. The model became unstable when given more than 30 words per hypothesis, so it was kept at the cluster-discovery stage only.</p>
              </div>
              <div>
                <div className="text-slate-900 font-semibold mb-1">Model details</div>
                <p className="leading-relaxed">Sentence-transformer embeddings, followed by UMAP dimensionality reduction, HDBSCAN clustering, and c-TF-IDF topic representation. Two variants: (a) English-translated speeches, (b) multilingual pooled speeches. The multilingual variant is the main specification.</p>
              </div>
              <div>
                <div className="text-slate-900 font-semibold mb-1">What the clusters showed</div>
                <p className="leading-relaxed">The top 20 clusters are dominated by defence and military, economic security, and energy, broadly confirming the expected securitisation hierarchy in the 9th and 10th parliamentary terms. Smaller but distinct clusters validated the addition of Organised Crime, Food Security, Gender-Based Violence, and Foreign Information Interference as independent frames.</p>
              </div>
              <div>
                <div className="text-slate-900 font-semibold mb-1">Frame refinement examples</div>
                <ul className="leading-relaxed space-y-1 list-disc list-inside">
                  <li>Topic 43 (crime organised): added Organised Crime as a distinct political security risk</li>
                  <li>Topics 3 and 12 (women, gender, Iran): added Gender-Based Violence</li>
                  <li>Topic 7 (farmers, food, agriculture): added Food Security</li>
                  <li>Topics 9 and 17 (energy, gas): separated Energy from broad Economic security</li>
                  <li>Topics 20, 26, 47, 48: split Cyber from Foreign Information Interference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </PT>
  )
}
