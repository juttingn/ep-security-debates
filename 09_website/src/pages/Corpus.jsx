import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Database } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { TOP1_YEARLY, COUNTRIES, ORIENTATION_TOTALS, ORIENTATIONS, FRAMES } from '../data/ep_data'
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

      {/* Header + stats: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <PageHeader
            title="Corpus Overview"
            subtitle="European Parliament plenary speeches scraped from europarl.europa.eu (9th and 10th parliamentary terms, July 2019 to early 2026). Security-relevant speeches pre-filtered; paragraphs of at least 450 characters classified by a natural language inference model."
            icon={Database}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={totalParas.toLocaleString()}   label="Total paragraphs classified"   color="text-blue-600"    delay={0}    />
            <StatCard value={secParas.toLocaleString()}     label="Security-labelled paragraphs"  color="text-red-600"     delay={0.05} />
            <StatCard value={`${((secParas/totalParas)*100).toFixed(1)}%`} label="Security rate (multi-label)" color="text-amber-600" delay={0.1} />
            <StatCard value="28"                            label="National delegations"           color="text-emerald-600" delay={0.15} />
          </div>
        </div>
      </div>

      {/* Year chart: gray */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <ChartCard
            title="Paragraphs by Year (2019–2026)"
            description="Total classified paragraphs per year. 2019 and 2020 are small-sample years due to partial parliamentary term launch and COVID-related session disruptions. The 2022 surge reflects the Ukraine war driving a sustained increase in security debate volume."
            animationDelay={0.1}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={yearData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="year" tick={TICK} tickLine={false} axisLine={ALINE} />
                <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" name="Paragraphs" stroke="#3b82f6" fill="url(#gTotal)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Country + Orientation charts: white */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid md:grid-cols-2 gap-6">
            <ChartCard
              title="Security Paragraphs by Country"
              description="Security paragraph count per national delegation, sorted by total. Germany, Poland, and Ireland are the three largest delegations in the corpus."
              animationDelay={0.2}
            >
              <div className="space-y-1.5 mt-2 max-h-96 overflow-y-auto pr-1">
                {countryData.map((c, i) => {
                  const f = FRAME_MAP[c.domFrame]
                  return (
                    <div key={i} className={`flex items-center gap-2 text-xs ${c.highlight ? 'opacity-100' : 'opacity-80'}`}>
                      <div className="w-32 text-gray-500 truncate shrink-0">{c.name}</div>
                      <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.total / countryData[0].total) * 100}%` }}
                          transition={{ delay: i * 0.015 + 0.2, duration: 0.5 }}
                          className="h-full rounded"
                          style={{ background: c.highlight ? '#f59e0b' : '#3b82f6' }}
                        />
                      </div>
                      <div className="w-14 text-right text-gray-500">{c.total.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
            </ChartCard>

            <ChartCard
              title="Security Paragraphs by Political Orientation"
              description="Right-wing Members of the European Parliament produce the largest share of security discourse by volume. The right orientation alone accounts for roughly 37 percent of all security-labelled paragraphs."
              animationDelay={0.25}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orientData} margin={{ top: 5, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="orientation" tick={TICK} tickLine={false} axisLine={ALINE} angle={-15} textAnchor="end" />
                  <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Security paragraphs" radius={[3, 3, 0, 0]}>
                    {orientData.map((d, i) => (
                      <Cell key={i} fill={d.highlight ? '#f59e0b' : d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-gray-400 mt-2 italic">Paragraph counts are multi-label: a paragraph may be counted once per orientation group that produced it. Orientation is based on European Parliament political group membership.</p>
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Data Notes: gray */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Data Notes</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <span className="text-slate-900 font-medium block mb-1">Coverage</span>
                9th parliamentary term (July 2019 to June 2024) and 10th parliamentary term (July 2024 to early 2026). 2019 and 2020 are partial years with limited debate volume. The United Kingdom appears in the corpus until Brexit was completed.
              </div>
              <div>
                <span className="text-slate-900 font-medium block mb-1">Pre-filtering</span>
                Speeches were pre-filtered for security-relevant keywords before paragraph segmentation. The 78,041 classified paragraphs come from 19,859 speeches; the 37,201 security-labelled paragraphs received at least one classification label above the 0.4 confidence threshold.
              </div>
              <div>
                <span className="text-slate-900 font-medium block mb-1">Political orientation</span>
                Orientation is assigned at the European Parliament political group level and mapped to a six-category left-right scale. Non-Inscrits includes unaffiliated Members. Groups that changed name between the 9th and 10th terms (such as Identity and Democracy, which became Patriots for Europe) are aggregated under the relevant ideological category.
              </div>
            </div>
          </div>
        </div>
      </div>

    </PT>
  )
}
