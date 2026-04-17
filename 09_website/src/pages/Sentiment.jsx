import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { MessageSquare } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { SENTIMENT_BY_FRAME, SENTIMENT_BY_PARTY, SENTIMENT_YEARLY, PARTIES } from '../data/placeholder'
import { PageHeader, ChartCard, CustomTooltip } from '../components/ui'

const PT = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
)

function SentimentBar({ score }) {
  const pct = Math.abs(score) * 100
  const pos = score >= 0
  return (
    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative">
      <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
      <div
        className="absolute top-0 h-full rounded-full"
        style={{
          width: `${pct / 2}%`,
          left: pos ? '50%' : `${50 - pct / 2}%`,
          background: pos ? '#22c55e' : '#ef4444',
        }}
      />
    </div>
  )
}

export default function Sentiment() {
  const { party } = useFilters()

  const partyFiltered = useMemo(() =>
    party !== 'All' ? SENTIMENT_BY_PARTY.filter(p => p.party === party) : SENTIMENT_BY_PARTY,
    [party]
  )

  return (
    <PT>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Sentiment Analysis"
          subtitle="VADER compound scores applied to security-coded speeches. Scores range from −1 (most negative/alarmed) to +1 (most positive/constructive). The corpus mean is −0.05 for security speeches vs. +0.08 overall."
          icon={MessageSquare}
        />

        {/* Sentiment by frame */}
        <ChartCard
          title="Average Sentiment by Security Frame"
          description="Human security and counter-terrorism speeches carry the most negative tone; military speeches trend slightly positive (budget approvals, mission endorsements, allied solidarity)."
          className="mb-6"
          animationDelay={0.1}
        >
          <div className="space-y-4 mt-2">
            {SENTIMENT_BY_FRAME.map((item, i) => (
              <motion.div key={item.frame} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}
                className="flex items-center gap-4">
                <div className="w-32 text-sm text-slate-300 font-medium shrink-0">{item.label}</div>
                <div className="text-xs text-slate-500 w-12 text-right shrink-0">{item.score > 0 ? `+${item.score}` : item.score}</div>
                <SentimentBar score={item.score} />
                <div className="hidden md:flex items-center gap-2 text-[10px] w-52 shrink-0">
                  <span className="text-emerald-500">{item.positive}% pos</span>
                  <span className="text-slate-600">{item.neutral}% neu</span>
                  <span className="text-red-500">{item.negative}% neg</span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* By party */}
          <ChartCard title="Sentiment by Party Group" description="Far-right groups score positive (assertive framing); Left and Greens score most negative (humanitarian critique)." animationDelay={0.2}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={partyFiltered} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="party" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} angle={-20} textAnchor="end" />
                <YAxis domain={[-0.35, 0.35]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                <Bar dataKey="score" name="Sentiment score" radius={[3, 3, 0, 0]}>
                  {partyFiltered.map((entry, i) => {
                    const pd = PARTIES.find(p => p.party === entry.party)
                    return <Cell key={i} fill={entry.score >= 0 ? (pd?.color ?? '#6b7280') : '#475569'} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Over time */}
          <ChartCard title="Average Sentiment Over Time" description="Dips visible around 9/11, the 2015 refugee crisis, and the 2022 Ukraine invasion — moments when security language became most alarmed." animationDelay={0.25}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={SENTIMENT_YEARLY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} interval={4} />
                <YAxis domain={[-0.3, 0.15]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                <ReferenceLine x={2001} stroke="#f97316" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: '9/11', fill: '#f97316', fontSize: 9, position: 'insideTopRight' }} />
                <ReferenceLine x={2015} stroke="#eab308" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: '2015', fill: '#eab308', fontSize: 9, position: 'insideTopRight' }} />
                <ReferenceLine x={2022} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: '2022', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="sentiment" name="Avg. sentiment" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="card p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Interpretation note:</strong> VADER compound scores range from −1 to +1. Security speeches average −0.05 overall, below the corpus mean of +0.08.
          The pronounced negativity in Human Security framing reflects humanitarian advocacy rhetoric (urgency, condemnation, moral appeal).
          Military frame speeches trend positive because they often involve budget approvals, mission endorsements and allied solidarity.
          The left–right gap in sentiment is consistent with the LLM urgency findings: ideological position predicts not only topic but tone.
        </div>
      </div>
    </PT>
  )
}
