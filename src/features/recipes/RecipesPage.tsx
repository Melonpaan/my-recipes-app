import { useRecipes } from './hooks/useRecipes'
import { RecipeForm, RecipesTable, ManageIngredientsModal } from './components'
import { SearchFilters } from '../../components/SearchFilters'

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
    search,
    categoryFilter,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
    handleCategoryChange,
  } = useRecipes()

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-lg text-zinc-500 dark:text-zinc-400">Chargement…</div>
    </div>
  )

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Mes recettes
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Créez et gérez vos recettes préférées</p>
      </div>

      <SearchFilters
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={handleSearchReset}
        onNewClick={openCreateForm}
        placeholder="Rechercher une recette…"
        newButtonLabel="+ Nouvelle recette"
        extraFilters={
          <select
            className="border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        }
      />

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


