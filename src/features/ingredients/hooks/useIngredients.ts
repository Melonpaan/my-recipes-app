import { useMemo, useState } from 'react'
import {
  useIngredientsQuery,
  useUnitsQuery,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from './useIngredientsQuery'

type Row = { id: string; name: string; unitId: string; stockQty: number }
type FormData = { id?: string; name: string; unitId: string; stockQty: string }
type FormMode = 'create' | 'edit'

export function useIngredients() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [form, setForm] = useState<FormData>({
    name: '',
    unitId: '',
    stockQty: '0',
  })

  // React Query hooks
  const { data: ingredientsData, isLoading: isLoadingIngredients } = useIngredientsQuery(debouncedSearch)
  const { data: unitsData, isLoading: isLoadingUnits } = useUnitsQuery()
  const createMutation = useCreateIngredient()
  const updateMutation = useUpdateIngredient()
  const deleteMutation = useDeleteIngredient()

  const loading = isLoadingIngredients || isLoadingUnits

  // Dériver les unités et calculer la map de conversion
  const units = useMemo(() => unitsData?.items ?? [], [unitsData])
  
  const unitIdToCode = useMemo(() => {
    const map = new Map<string, string>()
    const unitsList = unitsData?.items ?? []
    for (const u of unitsList) map.set(u.id, u.code)
    return map
  }, [unitsData])

  // Dériver les items visibles triés
  const visibleItems = useMemo(() => {
    const itemsList = ingredientsData?.items ?? []
    return itemsList.sort((a, b) => a.name.localeCompare(b.name))
  }, [ingredientsData])

  function openCreateForm() {
    setFormMode('create')
    setForm({ name: '', unitId: units[0]?.id ?? '', stockQty: '0' })
    setFormOpen(true)
  }

  function openEditForm(item: Row) {
    setFormMode('edit')
    setForm({ id: item.id, name: item.name, unitId: item.unitId, stockQty: item.stockQty.toString() })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this ingredient?')) return
    deleteMutation.mutate(id)
  }

  function handleSubmit() {
    // Basic UI validation
    const nameOk = form.name.trim().length > 0
    const unitOk = !!form.unitId
    const stockOk = /^\d+(\.\d{1,3})?$/.test(form.stockQty)
    if (!nameOk || !unitOk || !stockOk) {
      alert('Please fill valid values')
      return
    }

    if (formMode === 'create') {
      createMutation.mutate(
        { name: form.name.trim(), unitId: form.unitId, stockQty: parseFloat(form.stockQty) },
        { onSuccess: () => setFormOpen(false) }
      )
    } else if (form.id) {
      updateMutation.mutate(
        { id: form.id, name: form.name.trim(), unitId: form.unitId, stockQty: parseFloat(form.stockQty) },
        { onSuccess: () => setFormOpen(false) }
      )
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
  }

  function handleSearchSubmit() {
    setDebouncedSearch(search)
  }

  function handleSearchReset() {
    setSearch('')
    setDebouncedSearch('')
  }

  return {
    // State
    items: visibleItems, // Items triés et filtrés
    units,
    loading,
    search,
    formOpen,
    formMode,
    form,
    unitIdToCode,
    
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

