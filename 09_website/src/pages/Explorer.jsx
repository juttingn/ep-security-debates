import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { Globe, Users, X, Search } from 'lucide-react'
import { COUNTRIES, ORIENTATION_TOTALS, ORIENTATIONS, FRAMES } from '../data/placeholder'
import { PageHeader } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const FRAME_MAP = Object.fromEntries(FRAMES.map(f => [f.id, f]))
const ORIENT_MAP = Object.fromEntries(ORIENTATIONS.map(o => [o.id, o]))

function frameProfile(row, total) {
  return FRAMES
    .filter(f => f.id !== 'institutional_procedural')
    .map(f => ({ id: f.id, label: f.shortLabel, pct: +((row[f.id] / total) * 100).toFixed(1), color: f.color }))
    .sort((a, b) => b.pct - a.pct)
}

function radarData(row, total) {
  return FRAMES
    .filter(f => f.id !== 'institutional_procedural')
    .map(f => ({ subject: f.shortLabel, value: +((row[f.id] / total) * 100).toFixed(1) }))
}

function ProfilePanel({ entity, color, onClose }) {
  const isCountry = 'country' in entity
  const name  = isCountry ? entity.country : entity.orientation
  const flag  = isCountry ? entity.flag : null
  const total = entity.total
  const bars  = frameProfile(entity, total)
  const radar = radarData(entity, total)
  const topFrame = bars[0]

  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="card overflow-hidden"
      style={{ borderTopColor: color, borderTopWidth: 3 }}
    >
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {flag && <span className="text-2xl">{flag}</span>}
              {name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {total.toLocaleString()} security paragraphs · dominant frame:{' '}
              <span className="font-semibold" style={{ color: topFrame.color }}>{FRAME_MAP[topFrame.id]?.label}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 mt-1"><X size={15} /></button>
        </div>
      </div>

      <div className="p-5 grid sm:grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Frame Profile (multi-label %)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bars} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="label" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={60} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl">
                      <span className="text-white font-semibold">{d.payload.id.replace(/_/g, ' ')}</span>
                      <span className="text-slate-300 ml-2">{d.value}%</span>
                    </div>
                  )
                }}
              />
              <Bar dataKey="pct" name="%" radius={[0, 3, 3, 0]}>
                {bars.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Security Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radar} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8 }} />
              <Radar name={name} dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default function Explorer() {
  const [tab, setTab]           = useState('country')
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)

  const countryList = useMemo(() =>
    COUNTRIES.filter(c =>
      query === '' || c.country.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => b.total - a.total),
    [query]
  )

  const orientList = useMemo(() =>
    ORIENTATION_TOTALS.filter(o =>
      query === '' || o.orientation.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  )

  const list   = tab === 'country' ? countryList : orientList
  const selKey = tab === 'country' ? 'country' : 'orientation'
  const selColor = selected
    ? tab === 'country'
      ? '#3b82f6'
      : ORIENT_MAP[selected?.orientation]?.color ?? '#3b82f6'
    : '#3b82f6'

  function handleSelect(item) {
    const key = tab === 'country' ? item.country : item.orientation
    const curKey = tab === 'country' ? selected?.country : selected?.orientation
    setSelected(curKey === key ? null : item)
  }

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Country & Orientation Explorer"
          subtitle="Browse security frame profiles for each national delegation (28 countries) or political orientation (6 groups). Profile shows the share of each security frame in that entity's classified paragraphs."
          icon={Globe}
        />

        {/* Tabs + search */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {[
              { key: 'country',     label: 'By Country',     icon: Globe },
              { key: 'orientation', label: 'By Orientation', icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setSelected(null); setQuery('') }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tab === 'country' ? 'Search country…' : 'Search orientation…'}
              className="pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>
          <span className="text-xs text-slate-600">{list.length} {tab === 'country' ? 'countries' : 'orientations'}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
            {list.map((item, i) => {
              const name  = item[selKey]
              const flag  = item.flag ?? null
              const color = tab === 'orientation' ? (ORIENT_MAP[item.orientation]?.color ?? '#64748b') : '#3b82f6'
              const isSelected = tab === 'country' ? selected?.country === name : selected?.orientation === name
              return (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.012 }}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected ? 'bg-blue-900/30 border-blue-600/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {flag && <span className="text-lg shrink-0">{flag}</span>}
                      {!flag && (
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                      )}
                      <span className="text-sm font-semibold text-white">{name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{item.total.toLocaleString()}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Profile */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <ProfilePanel
                  key={tab === 'country' ? selected.country : selected.orientation}
                  entity={selected}
                  color={selColor}
                  onClose={() => setSelected(null)}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-72 flex flex-col items-center justify-center text-slate-700 card"
                >
                  <Globe size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Select a {tab === 'country' ? 'country' : 'political orientation'} to view its security frame profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Note */}
        <p className="text-[11px] text-slate-600 mt-6 italic">
          All percentages are multi-label shares: a paragraph may be counted for multiple frames simultaneously. Profiles show what fraction of that entity's classified paragraphs were labelled with each security frame. The dominant frame is the one with the highest share.
        </p>
      </div>
    </PT>
  )
}
