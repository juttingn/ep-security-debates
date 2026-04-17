import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Layers, Shield, MessageSquare, Brain, Search, Globe } from 'lucide-react'

function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <>{val.toLocaleString()}{suffix}</>
}

const STATS = [
  { label: 'Plenary speeches',   target: 487000, suffix: '+', color: 'text-blue-400' },
  { label: 'MEPs covered',       target: 3200,   suffix: '',  color: 'text-amber-400' },
  { label: 'Security-flagged',   target: 42000,  suffix: '+', color: 'text-red-400' },
  { label: 'Years of debates',   target: 32,     suffix: '',  color: 'text-emerald-400' },
]

const PIPELINE = [
  { step: '01', icon: Globe,          label: 'Scraping',      desc: 'Full EP plenary verbatim records 1994–2026 via scrapy',              to: '/corpus' },
  { step: '02', icon: Database,       label: 'Corpus Prep',   desc: 'Speaker classification, deduplication, language detection',          to: '/corpus' },
  { step: '03', icon: Layers,         label: 'Topic Model',   desc: 'LDA/BERTopic latent topic discovery across 500k speeches',           to: '/topics' },
  { step: '04', icon: Shield,         label: 'Frame Detection',desc: 'Sentence-level security frame classification (5 categories)',       to: '/security' },
  { step: '05', icon: MessageSquare,  label: 'Sentiment',     desc: 'VADER compound scores across frames, parties and time',              to: '/sentiment' },
  { step: '06', icon: Brain,          label: 'LLM Annotation',desc: 'GPT-4o zero-shot annotation for EU vs national framing & urgency',   to: '/llm' },
  { step: '07', icon: Search,         label: 'Explorer',      desc: 'Interactive website with MEP lookup, filters and data download',     to: '/explorer' },
]

const FINDINGS = [
  { color: '#ef4444', tag: 'Key finding',  title: 'Ukraine 2022 → military discourse tripled',         body: 'Speeches coded as military/defence reached 36% of all security speeches in 2022–23, up from 11% in 2021. The shift was sharpest in Baltic and Polish delegations.' },
  { color: '#3b82f6', tag: 'Key finding',  title: 'Cyber is the fastest-growing frame since 2013',    body: 'From under 2% of security speeches in 2010, cyber framing now accounts for 20%+ — a trajectory driven by EPP, Renew and Nordic delegations.' },
  { color: '#f97316', tag: 'Key finding',  title: '2015–16 border security spike dwarfs 9/11',         body: 'The refugee crisis produced a border/migration security spike in the EP twice the size of the post-9/11 terrorism surge, and markedly more partisan.' },
  { color: '#a855f7', tag: 'Key finding',  title: 'Sharp left–right divide in urgency scores',         body: 'ID/PfE and ECR speeches score 40% higher on urgency than S&D and Greens. The Left is most measured. Security rhetoric is a reliable ideological signal.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(12)].map((_, i) => <span key={i} className="text-eu-gold text-xs">★</span>)}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Security in the <br />
              <span className="gradient-text">European Parliament</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
              A computational text analysis of how European legislators have framed, debated
              and contested security across 32 years of plenary sessions — by country, party
              and legislative period.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/security" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors">
                Explore Security Frames <ArrowRight size={14} />
              </Link>
              <Link to="/explorer" className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-700">
                Search MEPs <Search size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ label, target, suffix, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }} className="text-center">
              <div className={`text-3xl font-extrabold ${color} mb-1`}>
                <AnimatedCounter target={target} suffix={suffix} />
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key findings */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-xl font-bold text-white mb-2">Key Findings</h2>
        <p className="text-sm text-slate-500 mb-8">Preliminary results from placeholder analysis — will be updated as the pipeline completes.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {FINDINGS.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
              className="card p-5 border-l-2" style={{ borderLeftColor: f.color }}>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: f.color }}>{f.tag}</span>
              <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="text-xl font-bold text-white mb-2">Analysis Pipeline</h2>
          <p className="text-sm text-slate-500 mb-8">Seven steps from raw HTML to interactive visualisation.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PIPELINE.map(({ step, icon: Icon, label, desc, to }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                <Link to={to} className="block card p-4 hover:border-blue-700/50 hover:bg-slate-800/50 transition-colors h-full group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-slate-600">{step}</span>
                    <Icon size={14} className="text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">{label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research motivation */}
      <section className="border-t border-slate-800 max-w-7xl mx-auto px-6 py-14">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold text-white mb-4">Research Motivation</h2>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>This project grows out of a shared interest in the <strong className="text-slate-200">political economy of security in the European Union</strong> — and in particular, the contested nature of what "security" means inside Europe's core deliberative institution.</p>
            <p>Security has never been a stable concept in EU politics. From Cold War anxieties to the post-9/11 expansion of internal security regimes, from migration debates recast as border threats to the post-2022 resurgence of hard defence, the EP's plenary debates offer a longitudinal record of how security frames emerge, compete, and shift.</p>
            <p>By combining web scraping, topic modelling, sentiment analysis, and LLM annotation, we map how security discourse has evolved across <strong className="text-slate-200">seven parliamentary terms</strong>, identifying the role of crises, elections, and ideological cleavages in shaping what European legislators say — and don't say — about security.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
