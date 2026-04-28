import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Layers, Shield, Globe } from 'lucide-react'

function AnimatedCounter({ target, duration = 1800 }) {
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
  return <>{val.toLocaleString()}</>
}

const STATS = [
  { label: 'Security paragraphs',   target: 37201 },
  { label: 'Security frames',       target: 13    },
  { label: 'Countries represented', target: 28    },
  { label: 'Years covered (EP9–10)',target: 7     },
]

const PIPELINE = [
  { step: '01', icon: Globe,    label: 'Corpus',          desc: 'EP plenary verbatim records 2019–2026 scraped from europarl.europa.eu; speaker roles and national delegations classified.',   to: '/corpus'   },
  { step: '02', icon: Layers,   label: 'Topics',          desc: 'BERTopic inductive clustering (53 topics) on security-filtered speeches to validate and expand frame selection.',              to: '/topics'   },
  { step: '03', icon: Shield,   label: 'Security Frames', desc: 'Paragraph-level zero-shot NLI classification into 13 security frames using mDeBERTa-v3-mnli-xnli.',                            to: '/security' },
  { step: '04', icon: Database, label: 'Robustness',      desc: 'Two specification checks: ML vs EN translation and paragraph vs context-window granularity (Pearson correlations).',            to: '/security' },
  { step: '05', icon: Globe,    label: 'Explorer',        desc: 'Interactive explorer with country and orientation frame profiles, security breakdowns by year, and full methodology.',          to: '/explorer' },
]

const FINDINGS = [
  { color: '#1e40af', title: 'Economic security dominates EP security discourse',     body: 'Economic security accounts for ~43–46% of all top-1 frame assignments — stable across all years, driven by sanctions, trade coercion and supply-chain vulnerabilities.' },
  { color: '#dc2626', title: 'Military framing surges post-2022 Ukraine invasion',    body: 'Military defence rises from ~13% (2021) to ~19% (2025). The post-invasion shift represents the largest single-frame change in the 2019–2026 window.' },
  { color: '#d97706', title: 'Energy security nearly doubles from 2022 onward',       body: 'Energy security jumps from ~8% (pre-2022) to ~15% (2026), reflecting sustained European discourse on gas dependency, price shocks and the post-invasion energy crisis.' },
  { color: '#0d9488', title: 'Health security: sharp COVID spike then rapid decline', body: 'Health security peaks at 5–6% of top-1 frames in 2020–21 and falls below 1% as COVID recedes — a classic securitisation arc with a clear beginning and end.' },
]

export default function Home() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Sciences Po · Computational Text Analysis · 2019–2026
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
              Security in the European Parliament
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
              A computational analysis of how European legislators have framed, debated and contested
              security across EP9–10 (2019–2026) — by country, political orientation, and year.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/security" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors">
                Explore Security Frames <ArrowRight size={14} />
              </Link>
              <Link to="/explorer" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-200 font-semibold rounded-lg text-sm transition-colors">
                Browse Countries <Globe size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ label, target }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }} className="text-center">
              <div className="text-4xl font-extrabold text-slate-900 mb-1">
                <AnimatedCounter target={target} />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Research motivation — above key findings */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Research Questions</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Why does security framing in the EP matter?</h2>
            <div className="space-y-4 text-base text-gray-600 leading-relaxed">
              <p>This project grows out of a shared interest in the <strong className="text-slate-800">political economy of security in the European Union</strong> — and in particular, the contested nature of what "security" means inside Europe's core deliberative institution.</p>
              <p>Security has never been a stable concept in EU politics. From migration debates recast as border threats to the post-2022 resurgence of hard defence, the EP's plenary debates offer a longitudinal record of how security frames emerge, compete, and shift across a period of extraordinary geopolitical turbulence.</p>
              <p>By combining web scraping, topic modelling, and zero-shot NLI classification, we map how security discourse has evolved across <strong className="text-slate-800">two parliamentary terms (EP9–10, 2019–2026)</strong>, identifying the role of crises, elections, and ideological cleavages in shaping what European legislators say — and don't say — about security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key findings */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Findings</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Key Findings</h2>
          <p className="text-sm text-gray-500 mb-10">
            From the zero-shot NLI classification pipeline (EP9–10, 2019–2026). 37,201 security-labelled paragraphs across 28 national delegations.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {FINDINGS.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
                className="bg-white border border-gray-200 rounded-xl p-6 border-l-4"
                style={{ borderLeftColor: f.color }}
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Methodology</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Analysis Pipeline</h2>
          <p className="text-sm text-gray-500 mb-10">Five steps from raw HTML to interactive visualisation.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PIPELINE.map(({ step, icon: Icon, label, desc, to }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                <Link to={to} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all h-full group">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-gray-400">{step}</span>
                    <Icon size={14} className="text-blue-600 group-hover:text-blue-700" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
