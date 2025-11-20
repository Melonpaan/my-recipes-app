import { useState, useEffect } from 'react'

export function AppShell({ tab, onTab }: { tab: 'recipes' | 'ingredients' | 'categories'; onTab: (t: 'recipes' | 'ingredients' | 'categories') => void }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const el = document.documentElement
    const newIsDark = !isDark
    if (newIsDark) {
      el.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      el.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    setIsDark(newIsDark)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-600/30">
            RM
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Recipe Manager</span>
        </div>
        <nav className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              tab === 'recipes' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white'
            }`}
            onClick={() => onTab('recipes')}
          >
            Recettes
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              tab === 'ingredients' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white'
            }`}
            onClick={() => onTab('ingredients')}
          >
            Ingrédients
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              tab === 'categories' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white'
            }`}
            onClick={() => onTab('categories')}
          >
            Catégories
          </button>
        </nav>
        <button
          aria-label="Changer le thème"
          className="p-2 rounded-lg border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
          onClick={toggleTheme}
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}


