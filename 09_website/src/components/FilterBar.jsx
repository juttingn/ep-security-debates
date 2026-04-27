import { Filter, X } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { COUNTRIES, ORIENTATIONS } from '../data/placeholder'

export default function FilterBar() {
  const { country, orientation, setFilter, resetFilters } = useFilters()
  const active = country !== 'All' || orientation !== 'All'

  return (
    <div className="sticky top-14 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2">
        <Filter size={12} className="text-slate-500 shrink-0" />
        <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Filter:</span>

        <select
          value={country}
          onChange={e => setFilter('country', e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All countries</option>
          {COUNTRIES.map(c => (
            <option key={c.country} value={c.country}>{c.flag} {c.country}</option>
          ))}
        </select>

        <select
          value={orientation}
          onChange={e => setFilter('orientation', e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All orientations</option>
          {ORIENTATIONS.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        {active && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600/20 border border-blue-600/40 text-blue-400 text-xs rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            <X size={10} /> Reset
          </button>
        )}

        {active && (
          <span className="text-xs text-amber-400 bg-amber-900/30 border border-amber-700/40 px-2 py-1 rounded-lg">
            Filtered view — charts highlight selected entity
          </span>
        )}
      </div>
    </div>
  )
}
