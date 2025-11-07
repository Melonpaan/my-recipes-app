import { useRecipes } from './hooks/useRecipes'
import { RecipeForm } from './components'

export function RecipesPage() {
  const { recipes, categories, loading, formOpen, form, setForm, openCreateForm, closeForm, handleSubmit, handleDelete, handleEdit, handleUpdate, editingId } =
    useRecipes()

  if (loading) return <div className="p-8 max-w-5xl mx-auto">Loading…</div>

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Recipes</h1>
      <button
        className="px-4 py-2 rounded-md border border-transparent bg-orange-600 text-white hover:bg-orange-500"
        onClick={openCreateForm}
      >
        Create Recipe
      </button>

      {recipes.length === 0 && <div className="mt-16 text-center opacity-70">No recipes yet</div>}

      {recipes.length > 0 && (
        <div className="mt-6 overflow-hidden border border-white/10 rounded-xl bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{categories.find((c) => c.id === r.categoryId)?.name ?? r.categoryId}</td>
                  <td className="px-4 py-3">{r.difficulty ?? '-'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 mr-2" onClick={() => handleEdit(r.id)}>Edit</button>
                    <button className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 text-red-400" onClick={() => { if (confirm('Delete this recipe?')) handleDelete(r.id) }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecipeForm
        isOpen={formOpen}
        form={form}
        categories={categories}
        onFormChange={setForm}
        isEdit={!!editingId}
        onSubmit={() => (editingId ? handleUpdate(editingId) : handleSubmit())}
        onCancel={closeForm}
      />
    </div>
  )
}


