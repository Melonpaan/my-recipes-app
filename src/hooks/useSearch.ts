import { useState } from 'react'

interface UseSearchOptions {
  useDebounce?: boolean  // true = server-side search, false = client-side
}

/**
 * Hook générique pour gérer la logique de recherche
 * Supporte le debouncing pour les recherches côté serveur
 * ou le filtrage direct côté client
 */
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
    // Si pas de debounce, le filtrage se fait côté client avec `search` directement
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

