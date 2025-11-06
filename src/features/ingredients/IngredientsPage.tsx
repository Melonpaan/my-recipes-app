import { useIngredients } from './hooks/useIngredients'
import { IngredientsFilters, IngredientsTable, IngredientForm } from './components'

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

  if (loading) return <div className="p-8 max-w-5xl mx-auto">Loading…</div>

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Ingredients</h1>

      <IngredientsFilters
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={handleSearchReset}
        onNewClick={openCreateForm}
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
