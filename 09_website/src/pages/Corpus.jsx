import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Database } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { TOP1_YEARLY, COUNTRIES, ORIENTATION_TOTALS, ORIENTATIONS, FRAMES } from '../data/placeholder'
import { PageHeader, StatCard, ChartCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const FRAME_MAP = Object.fromEntries(FRAMES.map(f => [f.id, f]))

function dominantFrame(row) {
  const frameKeys = FRAMES.map(f => f.id).filter(id => id !== 'institutional_procedural')
  return frameKeys.reduce((best, id) => (row[id] > (row[best] ?? 0) ? id : best), frameKeys[0])
}

export default function Corpus() {
  const { country, orientation } = useFilters()

  const totalParas = TOP1_YEARLY.reduce((s, d) => s + d.n, 0)
  const secParas   = COUNTRIES.reduce((s, c) => s + c.total, 0)

  const yearData = useMemo(() =>
    TOP1_YEARLY.map(d => ({ year: d.year, total: d.n })),
    []
  )

  const countryData = useMemo(() =>
    [...COUNTRIES]
      .sort((a, b) => b.total - a.total)
      .map(c => ({
        name:      c.flag + ' ' + c.country,
        total:     c.total,
        highlight: c.country === country,
        domFrame:  dominantFrame(c),
      })),
    [country]
  )

  const orientData = useMemo(() =>
    ORIENTATION_TOTALS.map(o => ({
      orientation: o.orientation,
      total:       o.total,
      color:       ORIENTATIONS.find(x => x.id === o.orientation)?.color ?? '#64748b',
      highlight:   o.orientation === orientation,
    })),
    [orientation]
  )

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Corpus Overview"
          subtitle="EP plenary speeches scraped from europarl.europa.eu (EP9–10, Jul 2019–early 2026). Security-relevant speeches pre-filtered; paragraphs (≥450 chars) classified by NLI model."
          icon={Database}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value={totalParas.toLocaleString()}   label="Total paragraphs classified"  color="text-blue-400"    delay={0}    />
          <StatCard value={secParas.toLocaleString()}     label="Security-labelled paragraphs" color="text-red-400"     delay={0.05} />
          <StatCard value={`${((secParas/totalParas)*100).toFixed(1)}%`} label="Security rate (multi-label)" color="text-amber-400" delay={0.1} />
          <StatCard value="28 countries"                  label="National delegations"          color="text-emerald-400" delay={0.15} />
        </div>

        {/* Timeline */}
        <ChartCard
          title="Paragraphs by Year (2019–2026)"
          description="Total classified paragraphs per year. 2019 and 2020 are small-sample years (partial EP9 launch + COVID session disruptions). The 2022 surge reflects the Ukraine war driving a sustained increase in security debate volume."
          className="mb-6"
          animationDelay={0.1}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={yearData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Paragraphs" stroke="#3b82f6" fill="url(#gTotal)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          {/* By country */}
          <ChartCard
            title="Security Paragraphs by Country"
            description="Multi-label security paragraph count per national delegation, sorted by total. Germany, Poland and Ireland are the three largest delegations in the corpus."
            animationDelay={0.2}
          >
            <div className="space-y-1.5 mt-2 max-h-96 overflow-y-auto pr-1">
              {countryData.map((c, i) => {
                const f = FRAME_MAP[c.domFrame]
                return (
                  <div key={i} className={`flex items-center gap-2 text-xs ${c.highlight ? 'opacity-100' : 'opacity-80'}`}>
                    <div className="w-32 text-slate-400 truncate shrink-0">{c.name}</div>
                    <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.total / countryData[0].total) * 100}%` }}
                        transition={{ delay: i * 0.015 + 0.2, duration: 0.5 }}
                        className="h-full rounded"
                        style={{ background: c.highlight ? '#f59e0b' : (f?.color ?? '#3b82f6') }}
                      />
                    </div>
                    <div className="w-14 text-right text-slate-400">{c.total.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          {/* By orientation */}
          <ChartCard
            title="Security Paragraphs by Political Orientation"
            description="Right-wing MEPs (EPP, ECR, PfE, ECR) produce the largest share of security discourse by volume. The Right orientation alone accounts for ~37% of all security-labelled paragraphs."
            animationDelay={0.25}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orientData} margin={{ top: 5, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="orientation" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Security paragraphs" radius={[3, 3, 0, 0]}>
                  {orientData.map((d, i) => (
                    <Cell key={i} fill={d.highlight ? '#f59e0b' : d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-600 mt-2 italic">Multi-label counts: a paragraph may be counted once per orientation group that produced it. Orientation based on EP political group membership.</p>
          </ChartCard>
        </div>

        {/* Corpus notes */}
        <div className="card p-5 mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">Data Notes</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div>
              <span className="text-slate-200 font-medium block mb-1">Coverage</span>
              EP9 (Jul 2019–Jun 2024) and EP10 (Jul 2024–early 2026). 2019 and 2020 are partial years with limited debate volume. The UK appears in the corpus until Brexit was completed.
            </div>
            <div>
              <span className="text-slate-200 font-medium block mb-1">Pre-filtering</span>
              Speeches were pre-filtered for security-relevant keywords before paragraph segmentation. The 78,041 classified paragraphs come from 19,859 speeches; the 37,201 security-labelled paragraphs received at least one NLI label above the 0.4 confidence threshold.
            </div>
            <div>
              <span className="text-slate-200 font-medium block mb-1">Political orientation</span>
              Orientation is assigned at the EP political group level and mapped to a six-category Left–Right scale. NI (Non-Inscrits) includes unaffiliated MEPs. Groups that changed name between EP9 and EP10 (e.g. ID → PfE) are aggregated under Right or Far-Right.
            </div>
          </div>
        </div>
      </div>
    </PT>
  )
}
