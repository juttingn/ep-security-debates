import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line, Legend,
} from 'recharts'
import { Globe, Users, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { COUNTRIES, ORIENTATION_TOTALS, ORIENTATIONS, FRAMES, CY_MULTI } from '../data/placeholder'
import { PageHeader } from '../components/ui'

const GEO_URL = '/world-110m.json'

// ISO 3166-1 numeric → country name (our 28 delegations)
const ISO_TO_COUNTRY = {
  40: 'Austria', 56: 'Belgium', 100: 'Bulgaria', 191: 'Croatia', 196: 'Cyprus',
  203: 'Czech Republic', 208: 'Denmark', 233: 'Estonia', 246: 'Finland', 250: 'France',
  276: 'Germany', 300: 'Greece', 348: 'Hungary', 372: 'Ireland', 380: 'Italy',
  428: 'Latvia', 440: 'Lithuania', 442: 'Luxembourg', 470: 'Malta', 528: 'Netherlands',
  616: 'Poland', 620: 'Portugal', 642: 'Romania', 703: 'Slovakia', 705: 'Slovenia',
  724: 'Spain', 752: 'Sweden', 826: 'United Kingdom',
}

const FRAME_MAP  = Object.fromEntries(FRAMES.map(f => [f.id, f]))
const ORIENT_MAP = Object.fromEntries(ORIENTATIONS.map(o => [o.id, o]))
const GRID = '#e5e7eb'
const TICK = { fill: '#9ca3af', fontSize: 9 }

// Dominant frame (highest % excluding institutional_procedural) from a CY_MULTI or COUNTRIES row
function dominantFrameId(row) {
  let best = null, bestVal = -1
  for (const f of FRAMES) {
    if (f.id === 'institutional_procedural') continue
    const v = row[f.id]
    if (v != null && v > bestVal) { bestVal = v; best = f.id }
  }
  return best
}

// Build map: country name → dominant frame id for a given year
function buildYearFrameMap(year) {
  const result = {}
  for (const row of CY_MULTI) {
    if (row.year === year) result[row.country] = dominantFrameId(row)
  }
  return result
}

// Frame profile bars (sorted, excluding institutional)
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

// ── Profile panel (bar + radar) ─────────────────────────────────────────────
function ProfilePanel({ entity, color, onClose }) {
  const isCountry = 'country' in entity
  const name      = isCountry ? entity.country : entity.orientation
  const flag      = isCountry ? entity.flag : null
  const total     = entity.total
  const bars      = frameProfile(entity, total)
  const radar     = radarData(entity, total)
  const topFrame  = bars[0]

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
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {flag && <span className="text-2xl">{flag}</span>}
              {name}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {total.toLocaleString()} security paragraphs · dominant frame:{' '}
              <span className="font-semibold" style={{ color: topFrame.color }}>{FRAME_MAP[topFrame.id]?.label}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 mt-1"><X size={15} /></button>
        </div>
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Frame Profile (multi-label %)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bars} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="label" tick={TICK} tickLine={false} axisLine={false} width={60} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs shadow-lg">
                      <span className="text-slate-900 font-semibold">{d.payload.id.replace(/_/g, ' ')}</span>
                      <span className="text-gray-600 ml-2">{d.value}%</span>
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
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Security Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radar} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 8 }} />
              <Radar name={name} dataKey="value" stroke={color} fill={color} fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

// ── Time series chart ───────────────────────────────────────────────────────
function CountryTimeSeries({ countryName }) {
  const rows = useMemo(() =>
    CY_MULTI.filter(r => r.country === countryName).sort((a, b) => a.year - b.year),
    [countryName]
  )

  // Top-6 frames by average % for this country
  const topFrames = useMemo(() => {
    if (!rows.length) return []
    return FRAMES
      .filter(f => f.id !== 'institutional_procedural')
      .map(f => ({
        ...f,
        avg: rows.reduce((s, r) => s + (r[f.id] ?? 0), 0) / rows.length,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6)
  }, [rows])

  const chartData = rows.map(r => {
    const point = { year: r.year, n: r.n }
    topFrames.forEach(f => { point[f.id] = r[f.id] ?? 0 })
    return point
  })

  if (!rows.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="card p-5 mt-4"
    >
      <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Frame Distribution Over Time</h3>
      <p className="text-xs text-gray-500 mb-4">Top-6 frames by average multi-label % · {countryName}</p>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="year" tick={TICK} tickLine={false} axisLine={false} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const row = rows.find(r => r.year === label)
              return (
                <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs shadow-lg min-w-[140px]">
                  <p className="font-semibold text-slate-900 mb-1.5">{label} <span className="text-gray-400 font-normal">({row?.n ?? '?'} paragraphs)</span></p>
                  {payload.sort((a, b) => b.value - a.value).map(p => (
                    <div key={p.dataKey} className="flex justify-between gap-4">
                      <span style={{ color: p.stroke }}>{FRAME_MAP[p.dataKey]?.shortLabel ?? p.dataKey}</span>
                      <span className="text-gray-600">{p.value}%</span>
                    </div>
                  ))}
                </div>
              )
            }}
          />
          <Legend
            iconType="circle"
            iconSize={6}
            formatter={(value) => (
              <span style={{ fontSize: 9, color: '#9ca3af' }}>{FRAME_MAP[value]?.shortLabel ?? value}</span>
            )}
          />
          {topFrames.map(f => (
            <Line
              key={f.id}
              type="monotone"
              dataKey={f.id}
              stroke={f.color}
              strokeWidth={2}
              dot={{ r: 3, fill: f.color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              name={f.id}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-gray-400 mt-1 italic">Only years with recorded security paragraphs are shown. Years 2019–2020 may be based on very few paragraphs.</p>
    </motion.div>
  )
}

// ── Choropleth map with year slider ────────────────────────────────────────
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function ChoroplethMap({ onSelectCountry }) {
  const [year, setYear] = useState(2024)
  const [tooltip, setTooltip] = useState(null)

  const yearFrameMap = useMemo(() => buildYearFrameMap(year), [year])

  return (
    <div className="card overflow-hidden">
      {/* Year slider header */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Dominant Security Frame by Country</h3>
            <p className="text-xs text-gray-500">Click a country to explore its full frame profile</p>
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{year}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setYear(y => Math.max(YEARS[0], y - 1))}
            disabled={year === YEARS[0]}
            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <input
            type="range"
            min={YEARS[0]}
            max={YEARS[YEARS.length - 1]}
            value={year}
            onChange={e => setYear(+e.target.value)}
            className="flex-1 h-1.5 appearance-none rounded bg-gray-200 accent-blue-600 cursor-pointer"
          />
          <button
            onClick={() => setYear(y => Math.min(YEARS[YEARS.length - 1], y + 1))}
            disabled={year === YEARS[YEARS.length - 1]}
            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
          <div className="flex gap-1 ml-1">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                  y === year
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative bg-slate-50">
        {tooltip && (
          <div
            className="absolute z-10 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none"
            style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
          >
            <span className="font-semibold text-slate-900">{tooltip.country}</span>
            {tooltip.frame && (
              <span className="ml-2" style={{ color: tooltip.frame.color }}>
                {tooltip.frame.label}
              </span>
            )}
            {!tooltip.frame && <span className="ml-2 text-gray-400">no data</span>}
          </div>
        )}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 860, center: [14, 54] }}
          width={800}
          height={480}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const isoId       = parseInt(geo.id, 10)
                const countryName = ISO_TO_COUNTRY[isoId]
                const frameId     = countryName ? yearFrameMap[countryName] : null
                const frame       = frameId ? FRAME_MAP[frameId] : null
                const fill        = frame ? frame.color + 'cc' : (countryName ? '#d1d5db' : '#e5e7eb')
                const isEU        = !!countryName

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={isEU ? 0.8 : 0.3}
                    style={{
                      default: { outline: 'none', cursor: isEU ? 'pointer' : 'default' },
                      hover:   { outline: 'none', fill: isEU ? (frame ? frame.color : '#94a3b8') : fill, opacity: isEU ? 0.85 : 1 },
                      pressed: { outline: 'none' },
                    }}
                    onClick={() => isEU && onSelectCountry(countryName)}
                    onMouseEnter={evt => {
                      if (!isEU) return
                      const rect = evt.target.closest('svg')?.getBoundingClientRect()
                      const x = evt.clientX - (rect?.left ?? 0)
                      const y = evt.clientY - (rect?.top ?? 0)
                      setTooltip({ country: countryName, frame, x, y })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Dominant frame (top-1 by multi-label %)</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {FRAMES.filter(f => f.id !== 'institutional_procedural').map(f => (
            <div key={f.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color }} />
              <span className="text-[10px] text-gray-500">{f.shortLabel}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#d1d5db] shrink-0" />
            <span className="text-[10px] text-gray-500">No data</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page transition wrapper ─────────────────────────────────────────────────
const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

// ── Main Explorer page ──────────────────────────────────────────────────────
export default function Explorer() {
  const [tab, setTab]           = useState('country')
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)

  const countryList = useMemo(() =>
    COUNTRIES
      .filter(c => query === '' || c.country.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.total - a.total),
    [query]
  )

  const orientList = useMemo(() =>
    ORIENTATION_TOTALS.filter(o => query === '' || o.orientation.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const list    = tab === 'country' ? countryList : orientList
  const selKey  = tab === 'country' ? 'country' : 'orientation'
  const selColor = selected
    ? tab === 'country' ? '#3b82f6' : (ORIENT_MAP[selected?.orientation]?.color ?? '#3b82f6')
    : '#3b82f6'

  function handleSelect(item) {
    const key    = tab === 'country' ? item.country : item.orientation
    const curKey = selected?.[selKey]
    setSelected(curKey === key ? null : item)
  }

  function switchTab(key) {
    setTab(key)
    setSelected(null)
    setQuery('')
  }

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Country & Orientation Explorer"
          subtitle="Browse security frame profiles for 28 national delegations or 6 political orientations. Select a country to see its full profile and how frames evolved year by year — or explore the map to compare dominant frames across Europe."
          icon={Globe}
        />

        {/* Tab + search bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {[
              { key: 'country',     label: 'By Country',     icon: Globe  },
              { key: 'orientation', label: 'By Orientation', icon: Users  },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tab === 'country' ? 'Search country…' : 'Search orientation…'}
              className="pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 w-48"
            />
          </div>
          <span className="text-xs text-gray-400">{list.length} {tab === 'country' ? 'countries' : 'orientations'}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: entity list */}
          <div className="lg:col-span-2 space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
            {list.map((item, i) => {
              const name      = item[selKey]
              const flag      = item.flag ?? null
              const color     = tab === 'orientation' ? (ORIENT_MAP[item.orientation]?.color ?? '#64748b') : '#3b82f6'
              const isSelected = selected?.[selKey] === name
              return (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.012 }}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {flag && <span className="text-lg shrink-0">{flag}</span>}
                      {!flag && <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />}
                      <span className="text-sm font-semibold text-slate-900">{name}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{item.total.toLocaleString()}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected[selKey]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ProfilePanel
                    entity={selected}
                    color={selColor}
                    onClose={() => setSelected(null)}
                  />
                  {tab === 'country' && (
                    <CountryTimeSeries countryName={selected.country} />
                  )}
                </motion.div>
              ) : tab === 'country' ? (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChoroplethMap onSelectCountry={name => {
                    const entity = COUNTRIES.find(c => c.country === name)
                    if (entity) setSelected(entity)
                  }} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-72 flex flex-col items-center justify-center text-gray-300 card"
                >
                  <Users size={36} className="mb-3 opacity-30" />
                  <p className="text-sm text-gray-400">Select a political orientation to view its security frame profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mt-6 italic">
          All percentages are multi-label shares: a paragraph may be counted for multiple frames simultaneously. Dominant frame on the map is the highest multi-label % for that country and year. Years with fewer than 5 paragraphs are shown with available data.
        </p>
      </div>
    </PT>
  )
}
