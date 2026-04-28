import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Layers, Shield, Globe } from 'lucide-react'
import epDebateImg from '../assets/ep_debate.jpg'

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
  { color: '#7c3aed', title: 'Eastern delegations drive military and threat framing', body: 'Baltic states (Estonia, Latvia, Lithuania) and Poland show the highest military frame shares — reflecting geographic proximity to Russia and strong NATO orientations. Mediterranean delegations (Italy, Spain, Malta) rank higher on border/migration and organised crime.' },
  { color: '#0369a1', title: 'Right-wing MEPs dominate security discourse by volume', body: 'The Right and Far-Right together account for ~47% of all security-labelled paragraphs. Left-wing MEPs proportionally emphasise gender-based violence and health security; right-wing MEPs emphasise border/migration and military defence.' },
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

      {/* Research motivation */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Research Questions</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Why does security framing in the EP matter?</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                <p>This project grows out of a shared interest in the <strong className="text-slate-800">political economy of security in the European Union</strong> — and in particular, the contested nature of what "security" means inside Europe's core deliberative institution.</p>
                <p>Security has never been a stable concept in EU politics. From migration debates recast as border threats to the post-2022 resurgence of hard defence, the EP's plenary debates offer a longitudinal record of how security frames emerge, compete, and shift across a period of extraordinary geopolitical turbulence.</p>
                <p>By combining web scraping, topic modelling, and zero-shot NLI classification, we map how security discourse has evolved across <strong className="text-slate-800">two parliamentary terms (EP9–10, 2019–2026)</strong>, identifying the role of crises, elections, and ideological cleavages in shaping what European legislators say — and don't say — about security.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <img
                src={epDebateImg}
                alt="MEPs debating in the European Parliament"
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </motion.div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {PIPELINE.map(({ step, icon: Icon, label, desc, to }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                <Link to={to} className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all h-full group">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">{step}</span>
                    <Icon size={18} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <div className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{label}</div>
                  <div className="text-sm text-gray-500 leading-relaxed flex-1">{desc}</div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={11} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations & Future Research */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Limitations & Future Research</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">What This Study Cannot Tell You</h2>
          <p className="text-sm text-gray-500 mb-10">Honest accounting of methodological constraints and directions for follow-up.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: 'EP plenary only',
                body: 'The corpus covers verbatim plenary records only. Committee debates, written questions, and informal inter-group negotiations — where much of the real bargaining over security policy happens — are not included.',
              },
              {
                title: 'Zero-shot classification limits',
                body: 'The mDeBERTa-v3 NLI classifier assigns frames without any fine-tuning on EP text. While robustness checks confirm broad reliability (≥0.72 cross-specification correlations), low-frequency frames (environmental, food, cyber) show weaker consistency.',
              },
              {
                title: 'Paragraph-level unit',
                body: 'Segmenting by blank-line paragraph (≥450 chars) means that short interjections and procedural remarks are excluded. Some speeches may be split across frames that would cohere as a single argumentative unit.',
              },
              {
                title: 'Cross-legislative-term comparison',
                body: 'EP9 and EP10 have different group compositions — in particular the renaming of ID to Patriots for Europe (PfE) and the emergence of the European Conservatives. Some shifts in frame shares may partly reflect membership changes rather than opinion change.',
              },
              {
                title: 'No speaker-level analysis',
                body: 'All results are aggregated to national delegation or political orientation level. Individual MEP positions, seniority effects, and committee roles are not modelled — a natural next step for a speaker-level study.',
              },
              {
                title: 'Binary security labelling',
                body: 'The pre-filtering step uses keyword matching to identify security-relevant speeches. Speeches that invoke security implicitly (without using explicit security vocabulary) are excluded from the corpus.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white border border-blue-100 rounded-xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Future direction: LLM-based deep classification</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              To unpack further details of the debates — such as the specific threat actors named, the policy instruments proposed, or the rhetorical strategies used to legitimise security claims — one natural extension is to apply large language model (LLM) classification at the paragraph level. This would allow researchers to move beyond frame detection toward a richer characterisation of <em>how</em> security is argued, not just <em>what</em> frame is invoked.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              A shell script implementing an LLM-classification pipeline for EP security paragraphs is available in the project repository. It was not applied as part of this project due to time and monetary constraints, but may be useful for researchers wishing to extend the analysis.
            </p>
            <a
              href="https://github.com/juttingn/ep-security-debates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View on GitHub — ep-security-debates
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
