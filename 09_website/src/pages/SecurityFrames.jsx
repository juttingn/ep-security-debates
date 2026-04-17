import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts'
import { Shield } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { YEARLY_DATA, COUNTRIES, PARTIES, FRAMES } from '../data/placeholder'
import { PageHeader, StatCard, ChartCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const EVENTS = [
  { year: 2001, label: '9/11', color: '#f97316' },
  { year: 2015, label: 'Refugee crisis', color: '#eab308' },
  { year: 2022, label: 'Ukraine invasion', color: '#ef4444' },
]

function EventLabel({ viewBox, event }) {
  const { x } = viewBox
  return (
    <g>
      <text x={x + 4} y={18} fill={event.color} fontSize={9} fontWeight={600}>{event.label}</text>
    </g>
  )
}

export default function SecurityFrames() {
  const { country, party } = useFilters()

  const scale = useMemo(() => {
    if (country !== 'All') {
      const c = COUNTRIES.find(x => x.name === country)
      return c ? c.speeches / COUNTRIES.reduce((s, x) => s + x.speeches, 0) : 1
    }
    if (party !== 'All') {
      const p = PARTIES.find(x => x.party === party)
      return p ? p.speeches / PARTIES.reduce((s, x) => s + x.speeches, 0) : 1
    }
    return 1
  }, [country, party])

  const timelineData = useMemo(() =>
    YEARLY_DATA.map(d => ({
      year: d.year,
      military:  Math.round(d.military  * scale),
      border:    Math.round(d.border    * scale),
      terrorism: Math.round(d.terrorism * scale),
      cyber:     Math.round(d.cyber     * scale),
      human:     Math.round(d.human     * scale),
    })),
    [scale]
  )

  const countryFrameData = useMemo(() =>
    [...COUNTRIES]
      .sort((a, b) => (b.secPct * b.speeches) - (a.secPct * a.speeches))
      .slice(0, 12)
      .map(c => ({ name: c.flag + ' ' + c.name.slice(0, 8), secSpeeches: Math.round(c.speeches * c.secPct / 100), pct: c.secPct, dominant: c.dominant })),
    []
  )

  const partyFrameData = useMemo(() =>
    PARTIES.map(p => {
      const frame = FRAMES.find(f => f.id === (p.id === 'epp' ? 'military' : p.id === 'sd' ? 'human' : p.id === 'greens' ? 'human' : p.id === 'id' ? 'border' : p.id === 'left' ? 'human' : p.id === 'ecr' ? 'military' : 'terrorism'))
      return { party: p.party, secSpeeches: Math.round(p.speeches * p.secPct / 100), pct: p.secPct, color: p.color }
    }),
    []
  )

  const totals = FRAMES.map(f => ({
    ...f,
    total: YEARLY_DATA.reduce((s, d) => s + Math.round(d[f.id] * scale), 0),
  }))

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Security Frame Detection"
          subtitle="Sentence-level security frame classification across five categories. A speech is flagged only when a security term and a threat/risk term co-occur in the same sentence, minimising false positives."
          icon={Shield}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {totals.map((f, i) => (
            <StatCard key={f.id} value={f.total.toLocaleString()} label={f.label} color="text-white" delay={i * 0.05} />
          ))}
        </div>

        {/* Stacked area timeline */}
        <ChartCard
          title="Security Frame Salience Over Time (1994–2025)"
          description="Stacked area of security-coded speech counts by frame per year. Vertical lines mark the three major crises driving debate spikes."
          className="mb-6"
          animationDelay={0.1}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timelineData} margin={{ top: 30, right: 20, left: 0, bottom: 0 }}>
              <defs>
                {FRAMES.map(f => (
                  <linearGradient key={f.id} id={`g_${f.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={f.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={f.color} stopOpacity={0.2} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} interval={4} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {EVENTS.map(e => (
                <ReferenceLine key={e.year} x={e.year} stroke={e.color} strokeDasharray="4 3" strokeWidth={1.5}>
                  <Label content={<EventLabel event={e} />} position="insideTopLeft" />
                </ReferenceLine>
              ))}
              {FRAMES.map(f => (
                <Area key={f.id} type="monotone" dataKey={f.id} name={f.label} stackId="1"
                  stroke={f.color} fill={`url(#g_${f.id})`} strokeWidth={1} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {FRAMES.map(f => (
              <div key={f.id} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ background: f.color }} />
                <span className="text-xs text-slate-400">{f.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          {/* By country */}
          <ChartCard
            title="Security Speech Volume by Country"
            description="Total security-coded speeches. Colour intensity reflects the country's security rate (% of all their speeches)."
            animationDelay={0.2}
          >
            <div className="space-y-1.5 mt-2">
              {countryFrameData.map((c, i) => {
                const frame = FRAMES.find(f => f.id === c.dominant)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-24 text-slate-400 truncate shrink-0">{c.name}</div>
                    <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.secSpeeches / countryFrameData[0].secSpeeches) * 100}%` }}
                        transition={{ delay: i * 0.03 + 0.2, duration: 0.5 }}
                        className="h-full rounded"
                        style={{ background: frame?.color ?? '#3b82f6' }}
                      />
                    </div>
                    <div className="w-12 text-right text-slate-400">{c.secSpeeches.toLocaleString()}</div>
                    <div className="w-9 text-right font-semibold" style={{ color: c.pct > 14 ? '#ef4444' : '#94a3b8' }}>{c.pct}%</div>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          {/* By party */}
          <ChartCard
            title="Security Speeches by Party Group"
            description="Security rate (%) per party group. ID/PfE scores highest (16%); The Left lowest (6%), suggesting security is a key axis of left–right differentiation."
            animationDelay={0.25}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={partyFrameData} margin={{ top: 5, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="party" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" name="Security rate (%)" radius={[3, 3, 0, 0]}>
                  {partyFrameData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PT>
  )
}
