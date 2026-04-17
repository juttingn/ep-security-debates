import { Filter, X } from 'lucide-react'
import { useFilters } from '../context/FilterContext'
import { COUNTRIES, PARTIES, PERIODS } from '../data/placeholder'

export default function FilterBar() {
  const { country, party, period, setFilter, resetFilters } = useFilters()
  const active = country !== 'All' || party !== 'All' || period !== 'All'

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
            <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>

        <select
          value={party}
          onChange={e => setFilter('party', e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All parties</option>
          {PARTIES.map(p => (
            <option key={p.id} value={p.party}>{p.party}</option>
          ))}
        </select>

        <select
          value={period}
          onChange={e => setFilter('period', e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All periods</option>
          {PERIODS.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
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
            Filtered view — data scaled proportionally
          </span>
        )}
      </div>
    </div>
  )
}
