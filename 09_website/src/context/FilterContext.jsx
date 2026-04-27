import { createContext, useContext, useState } from 'react'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({ country: 'All', orientation: 'All' })

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const resetFilters = () => setFilters({ country: 'All', orientation: 'All' })

  return (
    <FilterContext.Provider value={{ ...filters, setFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}
