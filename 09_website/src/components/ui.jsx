import { motion } from 'framer-motion'

export function PlaceholderBadge() {
  return (
    <span className="placeholder-badge">
      ⚠ placeholder data
    </span>
  )
}

export function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon size={20} className="text-blue-400 shrink-0" />}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {subtitle && <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">{subtitle}</p>}
    </div>
  )
}

export function StatCard({ value, label, icon: Icon, color = 'text-blue-400', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-4"
    >
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-xs text-slate-500 leading-tight">{label}</div>
      {Icon && <Icon size={14} className={`${color} mt-2 opacity-60`} />}
    </motion.div>
  )
}

export function ChartCard({ title, description, children, className = '', animationDelay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={`card p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <PlaceholderBadge />
      </div>
      {description && <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>}
      {children}
    </motion.div>
  )
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      {label != null && <p className="text-slate-400 mb-1.5 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-semibold">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}
