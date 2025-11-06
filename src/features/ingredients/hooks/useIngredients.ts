import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'

type Row = { id: string; name: string; unitId: string; stockQty: string }
type Unit = { id: string; code: string; name: string }
type FormData = { id?: string; name: string; unitId: string; stockQty: string }
type FormMode = 'create' | 'edit'

export function useIngredients() {
  const [items, setItems] = useState<Row[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [form, setForm] = useState<FormData>({
    name: '',
    unitId: '',
    stockQty: '0',
  })
  const toast = useToast()

  const unitIdToCode = useMemo(() => {
    const map = new Map<string, string>()
    for (const u of units) map.set(u.id, u.code)
    return map
  }, [units])

  async function loadData(query?: string) {
    setLoading(true)
    const [ing, un] = await Promise.all([
      api.ingredients.list({ page: 1, pageSize: 50, search: query && query.length ? query : undefined }),
      api.units.list({ page: 1, pageSize: 100 }),
    ])
    setItems(ing.items)
    setUnits(un.items)
    setLoading(false)
  }

  useEffect(() => {
    void loadData()
  }, [])

  const visibleItems = useMemo(() => {
    return items
      .filter((i) => (search ? i.name.toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [items, search])

  function openCreateForm() {
    setFormMode('create')
    setForm({ name: '', unitId: units[0]?.id ?? '', stockQty: '0' })
    setFormOpen(true)
  }

  function openEditForm(item: Row) {
    setFormMode('edit')
    setForm({ id: item.id, name: item.name, unitId: item.unitId, stockQty: item.stockQty })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ingredient?')) return
    try {
      const usage = await api.ingredients.usage({ id })
      if (usage.count > 0) {
        toast.error(`Used by ${usage.count} recipe(s)`)
        return
      }
      await api.ingredients.delete({ id })
      toast.success('Deleted successfully')
      void loadData(search)
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Delete failed'
      toast.error(msg)
    }
  }

  async function handleSubmit() {
    // Basic UI validation
    const nameOk = form.name.trim().length > 0
    const unitOk = !!form.unitId
    const stockOk = /^\d+(\.\d{1,3})?$/.test(form.stockQty)
    if (!nameOk || !unitOk || !stockOk) {
      alert('Please fill valid values')
      return
    }
    try {
      if (formMode === 'create') {
        await api.ingredients.create({ name: form.name.trim(), unitId: form.unitId, stockQty: form.stockQty })
        toast.success('Created successfully')
      } else if (form.id) {
        await api.ingredients.update({ id: form.id, name: form.name.trim(), unitId: form.unitId, stockQty: form.stockQty })
        toast.success('Updated successfully')
      }
      setFormOpen(false)
      void loadData(search)
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(msg)
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
  }

  function handleSearchSubmit() {
    void loadData(search)
  }

  function handleSearchReset() {
    setSearch('')
    void loadData('')
  }

  return {
    // State
    items: visibleItems,
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

