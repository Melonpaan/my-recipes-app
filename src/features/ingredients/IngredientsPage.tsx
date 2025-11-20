import { useIngredients } from './hooks/useIngredients'
import { IngredientsTable, IngredientForm } from './components'
import { SearchFilters } from '../../components/SearchFilters'

export function IngredientsPage() {
  const {
    items: visible,
    units,
    loading,
    search,
    formOpen,
    formMode,
    form,
    unitIdToCode,
    setForm,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
    handleSubmit,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
  } = useIngredients()

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-lg text-zinc-500 dark:text-zinc-400">Chargement…</div>
    </div>
  )

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Ingrédients
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Gérez votre inventaire de cuisine</p>
      </div>

      <SearchFilters
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={handleSearchReset}
        onNewClick={openCreateForm}
        placeholder="Rechercher un ingrédient…"
        newButtonLabel="+ Nouvel ingrédient"
      />

      <IngredientsTable
        items={visible}
        unitIdToCode={unitIdToCode}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />

      <IngredientForm
        isOpen={formOpen}
        mode={formMode}
        form={form}
        units={units}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    </div>
  )
}
