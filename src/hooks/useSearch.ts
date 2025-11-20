import { useState } from 'react'

interface UseSearchOptions {
  useDebounce?: boolean
}

/** Hook de recherche générique (supporte debouncing server-side ou filtrage client) */
export function useSearch(options: UseSearchOptions = {}) {
  const { useDebounce = false } = options
  
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  function handleSearchChange(value: string) {
    setSearch(value)
  }

  function handleSearchSubmit() {
    if (useDebounce) {
      setDebouncedSearch(search)
    }
  }

  function handleSearchReset() {
    setSearch('')
    if (useDebounce) {
      setDebouncedSearch('')
    }
  }

  return {
    search,
    debouncedSearch: useDebounce ? debouncedSearch : search,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
  }
}

