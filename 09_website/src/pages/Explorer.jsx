import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Search, User, X, Globe, Users, Download } from 'lucide-react'
import { MEPS, FRAMES } from '../data/placeholder'
import { PageHeader, PlaceholderBadge, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const PARTY_COLORS = {
  'EPP': '#3b82f6', 'S&D': '#ef4444', 'Renew': '#f59e0b',
  'Greens/EFA': '#22c55e', 'ECR': '#6366f1', 'ID/PfE': '#a855f7',
  'The Left': '#ec4899', 'NI': '#64748b',
}

const frameColor = id => FRAMES.find(f => f.id === id)?.color ?? '#94a3b8'

const ALL_COUNTRIES = ['All', ...Array.from(new Set(MEPS.map(m => m.country))).sort()]
const ALL_PARTIES   = ['All', ...Array.from(new Set(MEPS.map(m => m.party))).sort()]
const ALL_PERIODS   = ['All', '4th', '5th', '6th', '7th', '8th', '9th', '10th']

export default function Explorer() {
  const [query, setQuery]       = useState('')
  const [fCountry, setFC]       = useState('All')
  const [fParty, setFP]         = useState('All')
  const [fPeriod, setFPer]      = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => MEPS.filter(m => {
    const q = query.toLowerCase()
    return (
      (q === '' || m.name.toLowerCase().includes(q) || m.country.toLowerCase().includes(q) || m.party.toLowerCase().includes(q)) &&
      (fCountry === 'All' || m.country === fCountry) &&
      (fParty   === 'All' || m.party   === fParty)   &&
      (fPeriod  === 'All' || m.periods.some(p => p.startsWith(fPeriod)))
    )
  }), [query, fCountry, fParty, fPeriod])

  const mep = selected

  const frameBarData = mep
    ? Object.entries(mep.frameBreakdown).map(([k, v]) => ({ frame: k.charAt(0).toUpperCase() + k.slice(1), pct: v, color: frameColor(k) }))
    : []

  const radarData = mep
    ? Object.entries(mep.frameBreakdown).map(([k, v]) => ({ subject: k.charAt(0).toUpperCase() + k.slice(1), value: v }))
    : []

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="MEP Explorer"
          subtitle="Search 40 MEP profiles by name, country, party, or parliamentary period. Click a profile to view their security debate breakdown and notable quote."
          icon={Search}
        />

        {/* Search + filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, country or party…"
              className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          {[['country', fCountry, setFC, ALL_COUNTRIES], ['party', fParty, setFP, ALL_PARTIES], ['period', fPeriod, setFPer, ALL_PERIODS]].map(([label, val, setter, opts]) => (
            <select key={label} value={val} onChange={e => setter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
              {opts.map(o => <option key={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
            </select>
          ))}
          {(query || fCountry !== 'All' || fParty !== 'All' || fPeriod !== 'All') && (
            <button onClick={() => { setQuery(''); setFC('All'); setFP('All'); setFPer('All') }}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 rounded-lg transition-colors">
              <X size={11} /> Reset
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 text-sm rounded-lg transition-colors ml-auto">
            <Download size={12} /> Export CSV
          </button>
        </div>
        <p className="text-xs text-slate-600 mb-4">Showing {filtered.length} of {MEPS.length} MEPs</p>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="text-center text-slate-600 py-12 text-sm">No MEPs match your filters.</div>
            )}
            {filtered.map((m, i) => (
              <motion.button key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}
                onClick={() => setSelected(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selected?.id === m.id ? 'bg-blue-900/30 border-blue-600/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: PARTY_COLORS[m.party] ?? '#64748b' }}>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.country} · {m.party}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-bold" style={{ color: frameColor(m.dominantFrame) }}>{m.securityPct}%</div>
                    <div className="text-[9px] text-slate-600">security</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {m.periods.map(p => (
                    <span key={p} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-500">{p}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Profile */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {mep ? (
                <motion.div key={mep.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
                  className="card overflow-hidden" style={{ borderTopColor: PARTY_COLORS[mep.party], borderTopWidth: 3 }}>
                  {/* Header */}
                  <div className="p-5 border-b border-slate-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                          style={{ background: PARTY_COLORS[mep.party] }}>
                          {mep.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{mep.name}</h2>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-sm text-slate-400"><Globe size={12} /> {mep.country}</span>
                            <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: PARTY_COLORS[mep.party] }}>
                              <Users size={12} /> {mep.party}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {mep.periods.map(p => (
                              <span key={p} className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">{p} Parliament</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-1 mt-1"><X size={15} /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[
                        { v: mep.totalSpeeches.toLocaleString(), l: 'Total speeches' },
                        { v: mep.securitySpeeches,               l: 'Security speeches' },
                        { v: `${mep.securityPct}%`,              l: 'Security rate' },
                        { v: mep.sentimentScore > 0 ? `+${mep.sentimentScore}` : mep.sentimentScore, l: 'Avg sentiment' },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                          <div className="text-base font-bold text-white">{s.v}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="p-5 grid sm:grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">Frame Breakdown</h3>
                        <PlaceholderBadge />
                      </div>
                      <ResponsiveContainer width="100%" height={170}>
                        <BarChart data={frameBarData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="frame" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="pct" name="%" radius={[3, 3, 0, 0]}>
                            {frameBarData.map((d, i) => <Cell key={i} fill={d.color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">Security Profile</h3>
                        <PlaceholderBadge />
                      </div>
                      <ResponsiveContainer width="100%" height={170}>
                        <RadarChart data={radarData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                          <Radar name={mep.name} dataKey="value" stroke={PARTY_COLORS[mep.party]} fill={PARTY_COLORS[mep.party]} fillOpacity={0.25} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">Notable Quote</h3>
                      <PlaceholderBadge />
                    </div>
                    <blockquote className="border-l-2 pl-4 text-sm text-slate-400 italic leading-relaxed"
                      style={{ borderColor: PARTY_COLORS[mep.party] }}>
                      "{mep.notableQuote}"
                    </blockquote>
                    <p className="text-xs text-slate-600 mt-1">— {mep.name}, {mep.country}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-72 flex flex-col items-center justify-center text-slate-700 card">
                  <User size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Select an MEP to view their profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PT>
  )
}
