interface Props {
  search: string
  onSearchChange: (v: string) => void
  onSearchSubmit: () => void
  onSearchReset: () => void
  onNewClick: () => void
}

export function CategoriesFilters({ search, onSearchChange, onSearchSubmit, onSearchReset, onNewClick }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg p-3">
      <input
        className="border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 w-full sm:w-72 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Search categories…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearchSubmit()
        }}
      />
      <button
        className="px-4 py-2 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white transition-colors"
        onClick={onSearchSubmit}
      >
        Search
      </button>
      <button
        className="px-4 py-2 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white transition-colors"
        onClick={onSearchReset}
      >
        Reset
      </button>
      <button
        className="ml-auto px-4 py-2 rounded-md border border-transparent bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20 transition-colors"
        onClick={onNewClick}
      >
        + New
      </button>
    </div>
  )
}

