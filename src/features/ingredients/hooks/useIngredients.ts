import { useMemo, useState } from 'react'
import {
  useIngredientsQuery,
  useUnitsQuery,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from './useIngredientsQuery'
import { parseStockQty } from '../../../../shared/utils'
import { isValidStockQuantity } from '../../../utils/validationUtils'
import type { IngredientDTO } from '../../../../shared/ipc'
import { useToast } from '../../../components/Toaster'
import { useSearch } from '../../../hooks/useSearch'

type FormData = { id?: string; name: string; unitId: string; stockQty: string }
type FormMode = 'create' | 'edit'

export function useIngredients() {
  // Search avec debouncing (server-side)
  const { search, debouncedSearch, handleSearchChange, handleSearchSubmit, handleSearchReset } = useSearch({ 
    useDebounce: true 
  })

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
  const toast = useToast()

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

  function openEditForm(item: IngredientDTO) {
    setFormMode('edit')
    setForm({ id: item.id, name: item.name, unitId: item.unitId, stockQty: item.stockQty })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cet ingrédient ?')) return
    deleteMutation.mutate(id)
  }

  function handleSubmit() {
    // Basic UI validation
    const nameOk = form.name.trim().length > 0
    const unitOk = !!form.unitId
    const stockOk = isValidStockQuantity(form.stockQty)
    if (!nameOk || !unitOk || !stockOk) {
      toast.error('Veuillez remplir des valeurs valides')
      return
    }

    if (formMode === 'create') {
      createMutation.mutate(
        { name: form.name.trim(), unitId: form.unitId, stockQty: parseStockQty(form.stockQty) },
        { onSuccess: () => setFormOpen(false) }
      )
    } else if (form.id) {
      updateMutation.mutate(
        { id: form.id, name: form.name.trim(), unitId: form.unitId, stockQty: parseStockQty(form.stockQty) },
        { onSuccess: () => setFormOpen(false) }
      )
    }
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

