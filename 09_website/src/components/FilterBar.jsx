import { Filter, X } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { COUNTRIES, ORIENTATIONS } from '../data/ep_data'

export default function FilterBar() {
  const { country, orientation, setFilter, resetFilters } = useFilters()
  const active = country !== 'All' || orientation !== 'All'

  return (
    <div className="sticky top-14 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2">
        <Filter size={12} className="text-gray-400 shrink-0" />
        <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Filter:</span>

        <select
          value={country}
          onChange={e => setFilter('country', e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All countries</option>
          {COUNTRIES.map(c => (
            <option key={c.country} value={c.country}>{c.flag} {c.country}</option>
          ))}
        </select>

        <select
          value={orientation}
          onChange={e => setFilter('orientation', e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All orientations</option>
          {ORIENTATIONS.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        {active && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs rounded-lg hover:bg-blue-100 transition-colors"
          >
            <X size={10} /> Reset
          </button>
        )}

        {active && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
            Filtered view — charts highlight selected entity
          </span>
        )}
      </div>
    </div>
  )
}
