import './App.css'
import { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/AppShell'
import { IngredientsPage } from './features/ingredients/IngredientsPage'
import { RecipesPage } from './features/recipes/RecipesPage'
import { ToastProvider } from './components/Toaster'
import { queryClient } from './lib/react-query'

function App() {
  const [tab, setTab] = useState<'recipes' | 'ingredients'>('ingredients')
  useEffect(() => {
    // Default to dark theme
    document.documentElement.classList.add('dark')
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="min-h-screen">
          <AppShell tab={tab} onTab={setTab} />
          {tab === 'ingredients' ? <IngredientsPage /> : <RecipesPage />}
        </div>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
