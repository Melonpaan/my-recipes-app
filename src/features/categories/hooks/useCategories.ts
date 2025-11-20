import { useMemo, useState } from 'react'
import { useCategoriesQuery, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategoriesQuery'
import type { CategoryDTO } from '../../../../shared/ipc'
import { useSearch } from '../../../hooks/useSearch'

type FormData = { id?: string; name: string }
type FormMode = 'create' | 'edit'

export function useCategories() {
  // Search sans debouncing (client-side filtering)
  const { search, handleSearchChange, handleSearchSubmit, handleSearchReset } = useSearch({ 
    useDebounce: false 
  })

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [form, setForm] = useState<FormData>({ name: '' })

  // React Query hooks
  const { data: categoriesData, isLoading } = useCategoriesQuery()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // Filtered and sorted categories
  const visibleItems = useMemo(() => {
    const categories = categoriesData ?? []
    return categories
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [categoriesData, search])

  function openCreateForm() {
    setFormMode('create')
    setForm({ name: '' })
    setFormOpen(true)
  }

  function openEditForm(item: CategoryDTO) {
    setFormMode('edit')
    setForm({ id: item.id, name: item.name })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return
    deleteMutation.mutate({ id })
  }

  function handleSubmit() {
    // Basic UI validation
    const nameOk = form.name.trim().length > 0
    if (!nameOk) return

    if (formMode === 'create') {
      createMutation.mutate(
        { name: form.name.trim() },
        { onSuccess: () => setFormOpen(false) }
      )
    } else if (form.id) {
      updateMutation.mutate(
        { id: form.id, name: form.name.trim() },
        { onSuccess: () => setFormOpen(false) }
      )
    }
  }

  return {
    // State
    items: visibleItems,
    loading: isLoading,
    search,
    formOpen,
    formMode,
    form,

    // Actions
    setForm,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
    handleSubmit,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
  }
}

