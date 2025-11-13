import { useRecipes } from './hooks/useRecipes'
import { RecipeForm, RecipesTable, ManageIngredientsModal } from './components'

export function RecipesPage() {
  const {
    recipes,
    categories,
    ingredients,
    unitIdToCode,
    loading,
    formOpen,
    form,
    setForm,
    openCreateForm,
    closeForm,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleUpdate,
    editingId,
    ingredientsModalOpen,
    managingRecipe,
    handleManageIngredients,
    closeIngredientsModal,
    handleSaveIngredients,
  } = useRecipes()

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-lg text-zinc-500 dark:text-zinc-400">Loading…</div>
    </div>
  )

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            My Recipes
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">Create and manage your favorite recipes</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 font-medium"
          onClick={openCreateForm}
        >
          + New Recipe
        </button>
      </div>

      <RecipesTable
        recipes={recipes}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageIngredients={handleManageIngredients}
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

      {managingRecipe && (
        <ManageIngredientsModal
          isOpen={ingredientsModalOpen}
          recipeTitle={managingRecipe.title}
          currentIngredients={managingRecipe.ingredients || []}
          availableIngredients={ingredients}
          unitIdToCode={unitIdToCode}
          onSave={handleSaveIngredients}
          onCancel={closeIngredientsModal}
        />
      )}
    </div>
  )
}


