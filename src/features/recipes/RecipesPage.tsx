import { useRecipes } from './hooks/useRecipes'
import { RecipeForm, RecipesTable } from './components'

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

      <RecipesTable
        recipes={recipes}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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


