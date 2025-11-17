interface Props {
  isOpen: boolean
  mode: 'create' | 'edit'
  form: { id?: string; name: string }
  onFormChange: (f: { id?: string; name: string }) => void
  onSubmit: () => void
  onCancel: () => void
}

export function CategoryForm({ isOpen, mode, form, onFormChange, onSubmit, onCancel }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-xl shadow-lg p-5">
        <h2 className="text-lg font-semibold mb-3">
          {mode === 'create' ? 'New Category' : 'Edit Category'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">Name</label>
            <input
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="e.g. Desserts"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 border border-zinc-300 dark:border-white/20 rounded-md px-4 py-2 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-orange-600 text-white rounded-md px-4 py-2 hover:bg-orange-500 transition-colors"
            onClick={onSubmit}
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

