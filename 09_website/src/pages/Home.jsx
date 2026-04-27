import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Layers, Shield, Globe } from 'lucide-react'

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
  { label: 'Security paragraphs',  target: 37201,  suffix: '',   color: 'text-blue-400' },
  { label: 'Security frames',      target: 13,     suffix: '',   color: 'text-amber-400' },
  { label: 'Countries represented',target: 28,     suffix: '',   color: 'text-red-400' },
  { label: 'Years covered (EP9–10)',target: 7,      suffix: '',   color: 'text-emerald-400' },
]

const PIPELINE = [
  { step: '01', icon: Globe,     label: 'Scraping',        desc: 'EP plenary verbatim records 2019–2026 scraped from europarl.europa.eu; speaker roles and national delegations classified.',  to: '/corpus' },
  { step: '02', icon: Layers,    label: 'Topic Clusters',  desc: 'BERTopic inductive clustering (53 topics) on security-filtered speeches to validate and expand frame selection.',             to: '/topics' },
  { step: '03', icon: Shield,    label: 'Frame Detection', desc: 'Paragraph-level zero-shot NLI classification into 13 security frames using mDeBERTa-v3-mnli-xnli.',                           to: '/security' },
  { step: '04', icon: Database,  label: 'Robustness',      desc: 'Two specification checks: ML vs EN translation and paragraph vs context-window granularity (Pearson correlations).',           to: '/security' },
  { step: '05', icon: Globe,     label: 'Explorer',        desc: 'Interactive website with country/orientation explorer, security frame profiles, and full methodology.',                        to: '/explorer' },
]

const FINDINGS = [
  { color: '#3b82f6', tag: 'Key finding',  title: 'Economic security dominates EP security discourse',      body: 'Economic security accounts for ~43–46% of all top-1 frame assignments — stable across all years, driven by sanctions, trade coercion and supply-chain vulnerabilities.' },
  { color: '#ef4444', tag: 'Key finding',  title: 'Military framing surges post-2022 Ukraine invasion',     body: 'Military defence rises from ~13% (2021) to ~19% (2025). The post-invasion shift represents the largest single-frame change in the 2019–2026 window.' },
  { color: '#f59e0b', tag: 'Key finding',  title: 'Energy security nearly doubles from 2022 onward',        body: 'Energy security jumps from ~8% (pre-2022) to ~15% (2026), reflecting sustained European discourse on gas dependency, price shocks and the post-invasion energy crisis.' },
  { color: '#14b8a6', tag: 'Key finding',  title: 'Health security: sharp COVID spike then rapid decline',  body: 'Health security peaks at 5–6% of top-1 frames in 2020–21 and falls below 1% as COVID recedes — a classic securitisation arc with a clear beginning and end.' },
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
              and contested security across EP9–10 (2019–2026) — by country, political
              orientation and year.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/security" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors">
                Explore Security Frames <ArrowRight size={14} />
              </Link>
              <Link to="/explorer" className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-700">
                Browse Countries <Globe size={14} />
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
        <p className="text-sm text-slate-500 mb-8">From the zero-shot NLI classification pipeline (EP9–10, 2019–2026). 37,201 security-labelled paragraphs across 28 national delegations.</p>
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
          <p className="text-sm text-slate-500 mb-8">Five steps from raw HTML to interactive visualisation.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
            <p>Security has never been a stable concept in EU politics. From migration debates recast as border threats to the post-2022 resurgence of hard defence, the EP's plenary debates offer a longitudinal record of how security frames emerge, compete, and shift across a period of extraordinary geopolitical turbulence.</p>
            <p>By combining web scraping, topic modelling, and zero-shot NLI classification, we map how security discourse has evolved across <strong className="text-slate-200">two parliamentary terms (EP9–10, 2019–2026)</strong>, identifying the role of crises, elections, and ideological cleavages in shaping what European legislators say — and don't say — about security.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
