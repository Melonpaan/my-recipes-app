import type { UnitDTO } from '../../../../shared/ipc'

type FormData = {
  id?: string
  name: string
  unitId: string
  stockQty: string
}

type IngredientFormProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  form: FormData
  units: UnitDTO[]
  onFormChange: (form: FormData) => void
  onSubmit: () => void
  onCancel: () => void
}

export function IngredientForm({
  isOpen,
  mode,
  form,
  units,
  onFormChange,
  onSubmit,
  onCancel,
}: IngredientFormProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-xl shadow-lg p-5">
        <h2 className="text-lg font-semibold mb-3">
          {mode === 'create' ? 'New Ingredient' : 'Edit Ingredient'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.unitId}
              onChange={(e) => onFormChange({ ...form, unitId: e.target.value })}
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code} — {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Stock qty</label>
            <input
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.stockQty}
              onChange={(e) => onFormChange({ ...form, stockQty: e.target.value })}
              placeholder="ex: 500 ou 1.5"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-500"
            onClick={onSubmit}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

