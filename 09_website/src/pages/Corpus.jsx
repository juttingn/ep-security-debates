import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Database } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { YEARLY_DATA, COUNTRIES, PARTIES } from '../data/placeholder'
import { PageHeader, StatCard, ChartCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

export default function Corpus() {
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

  const yearData = useMemo(() =>
    YEARLY_DATA.map(d => ({ ...d, total: Math.round(d.total * scale), security: Math.round(d.security * scale) })),
    [scale]
  )

  const countryData = useMemo(() =>
    [...COUNTRIES]
      .sort((a, b) => b.speeches - a.speeches)
      .slice(0, 18)
      .map(c => ({ name: c.flag + ' ' + c.name, speeches: c.speeches, secPct: c.secPct, highlight: c.name === country })),
    [country]
  )

  const partyData = useMemo(() =>
    PARTIES.map(p => ({ party: p.party, speeches: p.speeches, secPct: p.secPct, color: p.color })),
    []
  )

  const totalSpeeches = YEARLY_DATA.reduce((s, d) => s + Math.round(d.total * scale), 0)
  const totalSecurity = YEARLY_DATA.reduce((s, d) => s + Math.round(d.security * scale), 0)

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Corpus Overview"
          subtitle="487,000+ plenary speeches scraped from europarl.europa.eu, spanning EP4 (1994) through EP10 (2026). Speech turns are classified by speaker role, political group, national delegation and date."
          icon={Database}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value={totalSpeeches.toLocaleString()}          label="Total speeches"              color="text-blue-400"    delay={0}    />
          <StatCard value={totalSecurity.toLocaleString()}          label="Security-coded speeches"     color="text-red-400"     delay={0.05} />
          <StatCard value={`${((totalSecurity/totalSpeeches)*100).toFixed(1)}%`} label="Security rate"  color="text-amber-400"   delay={0.1}  />
          <StatCard value="28 countries"                            label="National delegations"        color="text-emerald-400" delay={0.15} />
        </div>

        {/* Timeline */}
        <ChartCard
          title="Speeches Over Time (1994–2025)"
          description="Total plenary speech turns per year and security-coded subset. Peaks in 2022–23 reflect the Ukraine war driving a surge in debate volume."
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
                <linearGradient id="gSec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} interval={4} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total"    name="Total speeches"    stroke="#3b82f6" fill="url(#gTotal)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="security" name="Security speeches" stroke="#ef4444" fill="url(#gSec)"   strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6">
          {/* By country */}
          <ChartCard
            title="Speeches by National Delegation (top 18)"
            description="Total speech turns per country. Right-hand percentage shows the share of that country's speeches coded as security-related."
            animationDelay={0.2}
          >
            <div className="space-y-1.5 mt-2">
              {countryData.map((c, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${c.highlight ? 'opacity-100' : 'opacity-80'}`}>
                  <div className="w-28 text-slate-400 truncate shrink-0">{c.name}</div>
                  <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.speeches / countryData[0].speeches) * 100}%` }}
                      transition={{ delay: i * 0.02 + 0.2, duration: 0.5 }}
                      className={`h-full rounded ${c.highlight ? 'bg-amber-400' : 'bg-blue-600'}`}
                    />
                  </div>
                  <div className="w-16 text-right text-slate-400">{c.speeches.toLocaleString()}</div>
                  <div className="w-10 text-right font-semibold" style={{ color: c.secPct > 14 ? '#ef4444' : c.secPct > 10 ? '#f97316' : '#94a3b8' }}>
                    {c.secPct}%
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* By party */}
          <ChartCard
            title="Speeches by Political Group"
            description="EPP and S&D dominate speech volume. ID/PfE has the highest share of security-coded speeches (16%), the Left the lowest (6%)."
            animationDelay={0.25}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={partyData} margin={{ top: 5, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="party" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="speeches" name="Total speeches" radius={[3, 3, 0, 0]}>
                  {partyData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PT>
  )
}
