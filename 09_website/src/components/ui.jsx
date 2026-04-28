import { motion } from 'framer-motion'

export function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon size={20} className="text-blue-600 shrink-0" />}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>
      {subtitle && <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">{subtitle}</p>}
    </div>
  )
}

export function StatCard({ value, label, color = 'text-blue-600', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500 leading-tight">{label}</div>
    </motion.div>
  )
}

export function ChartCard({ title, description, children, className = '', animationDelay = 0, placeholder = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={`card p-6 ${className}`}
    >
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-500 mb-4 leading-relaxed">{description}</p>}
      {children}
    </motion.div>
  )
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
      {label != null && <p className="text-gray-500 mb-1.5 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="text-slate-900 font-semibold">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}
