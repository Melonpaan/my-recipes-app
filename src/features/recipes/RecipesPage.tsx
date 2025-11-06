import { useEffect, useState } from 'react'
import { api } from '../../ipc/api'

export function RecipesPage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    api.categories.list({ page: 1, pageSize: 100 }).then((res) => setCategories(res.items))
  }, [])

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Recipes</h1>
      <button className="px-4 py-2 rounded-md border border-transparent bg-orange-600 text-white hover:bg-orange-500" onClick={() => setOpen(true)}>
        Create Recipe
      </button>

      {!open && <div className="mt-16 text-center opacity-70">No recipes yet</div>}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white text-black dark:bg-zinc-900 dark:text-white w-full max-w-2xl rounded-xl shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-3">Create New Recipe</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm mb-1">Title *</label>
                <input className="w-full border border-white/20 rounded-md px-3 py-2 bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select className="w-full border border-white/20 rounded-md px-3 py-2 bg-transparent" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md border border-transparent bg-orange-600 text-white hover:bg-orange-500"
                  onClick={async () => {
                    if (!title.trim()) {
                      alert('Title required')
                      return
                    }
                    await api.recipes.create({
                      title: title.trim(),
                      description: '',
                      prepTime: 0,
                      difficulty: null,
                      categoryId: categoryId || categories[0]?.id || '1',
                      userId: null,
                    })
                    setOpen(false)
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


