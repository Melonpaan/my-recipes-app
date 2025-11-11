import './App.css'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/AppShell'
import { IngredientsPage } from './features/ingredients/IngredientsPage'
import { RecipesPage } from './features/recipes/RecipesPage'
import { ToastProvider } from './components/Toaster'
import { queryClient } from './lib/react-query'

function App() {
  const [tab, setTab] = useState<'recipes' | 'ingredients'>('ingredients')
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
          <AppShell tab={tab} onTab={setTab} />
          {tab === 'ingredients' ? <IngredientsPage /> : <RecipesPage />}
        </div>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
