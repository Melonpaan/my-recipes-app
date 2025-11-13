import { useMemo } from 'react'
import type { RecipeDTO, CategoryDTO } from '../../../../shared/ipc'

type RecipesTableProps = {
  recipes: RecipeDTO[]
  categories: CategoryDTO[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onManageIngredients: (id: string) => void
}

export function RecipesTable({ recipes, categories, onEdit, onDelete, onManageIngredients }: RecipesTableProps) {
  // Create a lookup map for better performance (O(1) instead of O(n) for each row)
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]))
  }, [categories])

  const handleDeleteClick = (id: string) => {
    if (confirm('Delete this recipe?')) {
      onDelete(id)
    }
  }

  if (recipes.length === 0) {
    return <div className="mt-16 text-center opacity-70">No recipes yet</div>
  }

  return (
    <div className="mt-6 overflow-hidden border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-white/5">
      <table className="min-w-full text-sm">
        <thead className="bg-white/10">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Difficulty</th>
            <th className="px-4 py-3 text-left">Ingredients</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {recipes.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3">{r.title}</td>
              <td className="px-4 py-3">{categoryMap.get(r.categoryId) ?? r.categoryId}</td>
              <td className="px-4 py-3">{r.difficulty ?? '-'}</td>
              <td className="px-4 py-3">
                <button
                  className="px-2 py-1 text-xs rounded-md bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-600/30"
                  onClick={() => onManageIngredients(r.id)}
                >
                  Manage
                </button>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 mr-2"
                  onClick={() => onEdit(r.id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-red-500 dark:text-red-400"
                  onClick={() => handleDeleteClick(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

