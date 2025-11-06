export function AppShell({ tab, onTab }: { tab: 'recipes' | 'ingredients'; onTab: (t: 'recipes' | 'ingredients') => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-lg font-semibold">Recipe Manager</div>
        <nav className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${tab === 'recipes' ? 'bg-orange-600 text-white shadow' : 'border border-white/20 hover:bg-white/10'}`}
            onClick={() => onTab('recipes')}
          >
            Recipes
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${tab === 'ingredients' ? 'bg-orange-600 text-white shadow' : 'border border-white/20 hover:bg-white/10'}`}
            onClick={() => onTab('ingredients')}
          >
            Ingredients
          </button>
        </nav>
        <div className="flex items-center gap-3 text-sm opacity-80">
          <button
            aria-label="Toggle theme"
            className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10"
            onClick={() => {
              const el = document.documentElement
              el.classList.toggle('dark')
            }}
          >
            Theme
          </button>
          <span>Sign Out</span>
        </div>
      </div>
    </header>
  )
}


