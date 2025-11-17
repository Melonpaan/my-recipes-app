import { useCategories } from './hooks/useCategories'
import { CategoriesFilters, CategoriesTable, CategoryForm } from './components'

export function CategoriesPage() {
  const {
    items,
    loading,
    search,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
    formOpen,
    formMode,
    form,
    setForm,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
  } = useCategories()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-600 dark:text-zinc-400">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Categories
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Organize your recipes by category</p>
      </div>

      <CategoriesFilters
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={handleSearchReset}
        onNewClick={openCreateForm}
      />

      <CategoriesTable
        items={items}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />

      <CategoryForm
        isOpen={formOpen}
        mode={formMode}
        form={form}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    </div>
  )
}

