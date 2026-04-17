import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain } from 'lucide-react'
import { LLM_DATA } from '../data/placeholder'
import { PageHeader, ChartCard, StatCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

const EU_COLORS      = ['#3b82f6', '#6366f1', '#64748b']
const URGENCY_COLORS = ['#ef4444', '#f59e0b', '#22c55e']
const CROSS_COLORS   = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#64748b', '#94a3b8']

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, pct }) {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180)
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180)
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>{pct}%</text>
}

export default function LLMAnalysis() {
  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="LLM Annotation"
          subtitle="GPT-4o zero-shot annotation of security speeches for EU vs. national framing, urgency level, and cross-frame classification. Validated against a human-coded gold standard (κ = 0.81)."
          icon={Brain}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value={`κ = ${LLM_DATA.agreementScore}`} label="Inter-rater agreement (Cohen's κ)" color="text-emerald-400" delay={0}    />
          <StatCard value={LLM_DATA.sampleSize}              label="Human-annotated validation sample" color="text-blue-400"    delay={0.05} />
          <StatCard value="GPT-4o"                           label="Model"                             color="text-purple-400" delay={0.1}  />
          <StatCard value="Zero-shot"                        label="Prompting strategy"                color="text-amber-400"  delay={0.15} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* EU vs National */}
          <ChartCard title="EU vs. National Framing" description="Does the speaker frame security as a European collective challenge or a national interest?" animationDelay={0.1}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={LLM_DATA.euVsNational} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={75} labelLine={false} label={PieLabel}>
                  {LLM_DATA.euVsNational.map((_, i) => <Cell key={i} fill={EU_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {LLM_DATA.euVsNational.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: EU_COLORS[i] }} />
                    <span className="text-slate-400">{item.category}</span>
                  </div>
                  <span className="text-slate-200 font-semibold">{item.pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Urgency */}
          <ChartCard title="Urgency Level" description="High urgency = threat-alert, alarmist language; Measured = procedural, deliberative tone." animationDelay={0.15}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={LLM_DATA.urgency} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={75} labelLine={false} label={PieLabel}>
                  {LLM_DATA.urgency.map((_, i) => <Cell key={i} fill={URGENCY_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {LLM_DATA.urgency.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: URGENCY_COLORS[i] }} />
                    <span className="text-slate-400">{item.level}</span>
                  </div>
                  <span className="text-slate-200 font-semibold">{item.pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Cross-frame */}
          <ChartCard title="Cross-Frame Co-occurrence" description="Speeches coded with more than one security frame simultaneously. Border + Terrorism is the most common pairing." animationDelay={0.2}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={LLM_DATA.crossFrame} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="combination" type="category" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" name="% of speeches" radius={[0, 3, 3, 0]}>
                  {LLM_DATA.crossFrame.map((_, i) => <Cell key={i} fill={CROSS_COLORS[i % CROSS_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="card p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Annotation protocol:</strong> Each security-coded speech was submitted to GPT-4o with a structured zero-shot prompt containing:
          (1) speech text truncated to 1,500 tokens, (2) definitions of EU/national framing dichotomy drawn from securitisation theory,
          (3) a three-point urgency scale with anchor examples, and (4) a multi-label cross-frame task.
          The model returned structured JSON. Inter-rater reliability was computed against {LLM_DATA.sampleSize} speeches coded by two trained research assistants
          (κ = {LLM_DATA.agreementScore}, "almost perfect" agreement by Landis & Koch 1977 criteria).
        </div>
      </div>
    </PT>
  )
}
