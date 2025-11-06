import { useEffect, useMemo, useState } from 'react'
import { api } from '../../ipc/api'
import { useToast } from '../../components/Toaster'

type Row = { id: string; name: string; unitId: string; stockQty: string }
type Unit = { id: string; code: string; name: string }

export function IngredientsPage() {
  const [items, setItems] = useState<Row[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [form, setForm] = useState<{ id?: string; name: string; unitId: string; stockQty: string }>({
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

  if (loading) return <div className="p-8 max-w-5xl mx-auto">Loading…</div>

  const visible = items
    .filter((i) => (search ? i.name.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Ingredients</h1>

      <div className="mb-6 flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
        <input
          className="border border-white/20 rounded-md px-3 py-2 w-full sm:w-72 bg-transparent"
          placeholder="Search ingredients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void loadData(search)
          }}
        />
        <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={() => void loadData(search)}>Search</button>
        <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={() => { setSearch(''); void loadData('') }}>Reset</button>
        <button
          className="ml-auto px-4 py-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-500"
          onClick={() => {
            setFormMode('create')
            setForm({ name: '', unitId: units[0]?.id ?? '', stockQty: '0' })
            setFormOpen(true)
          }}
        >
          New
        </button>
      </div>

      {/* toast container handled globally */}

      <div className="overflow-hidden border border-white/10 rounded-xl bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {visible.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center" colSpan={4}>No ingredients</td>
              </tr>
            )}
            {visible.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-3">{i.name}</td>
                <td className="px-4 py-3">{unitIdToCode.get(i.unitId) ?? i.unitId}</td>
                <td className="px-4 py-3 text-right">{i.stockQty}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 mr-2"
                    onClick={() => {
                      setFormMode('edit')
                      setForm({ id: i.id, name: i.name, unitId: i.unitId, stockQty: i.stockQty })
                      setFormOpen(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 text-red-400"
                    onClick={async () => {
                      if (!confirm('Delete this ingredient?')) return
                      try {
                        const usage = await api.ingredients.usage({ id: i.id })
                        if (usage.count > 0) {
                          toast.error(`Used by ${usage.count} recipe(s)`) 
                          return
                        }
                        await api.ingredients.delete({ id: i.id })
                        toast.success('Deleted successfully')
                        void loadData(search)
                      } catch (err: unknown) {
                        console.error(err)
                        const msg = err instanceof Error ? err.message : 'Delete failed'
                        toast.error(msg)
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white text-black dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-xl shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-3">
              {formMode === 'create' ? 'New Ingredient' : 'Edit Ingredient'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="w-full border border-white/20 rounded-md px-3 py-2 bg-transparent"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Unit</label>
                <select
                  className="w-full border border-white/20 rounded-md px-3 py-2 bg-transparent"
                  value={form.unitId}
                  onChange={(e) => setForm((f) => ({ ...f, unitId: e.target.value }))}
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.code} — {u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Stock qty</label>
                <input
                  className="w-full border border-white/20 rounded-md px-3 py-2 bg-transparent"
                  value={form.stockQty}
                  onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
                  placeholder="0 or 12.345"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10" onClick={() => setFormOpen(false)}>Cancel</button>
              <button
                className="px-4 py-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-500"
                onClick={async () => {
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
                }}
              >
                {formMode === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
