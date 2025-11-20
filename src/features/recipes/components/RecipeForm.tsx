import type { CategoryDTO } from '../../../../shared/ipc'

type FormData = {
  title: string
  description: string
  prepTime: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
}

type RecipeFormProps = {
  isOpen: boolean
  form: FormData
  categories: CategoryDTO[]
  onFormChange: (form: FormData) => void
  onSubmit: () => void
  onCancel: () => void
  isEdit?: boolean
}

export function RecipeForm({
  isOpen,
  form,
  categories,
  onFormChange,
  onSubmit,
  onCancel,
  isEdit = false,
}: RecipeFormProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black dark:bg-zinc-900 dark:text-white w-full max-w-2xl rounded-xl shadow-lg p-5">
        <h2 className="text-lg font-semibold mb-3">{isEdit ? 'Modifier la recette' : 'Créer une nouvelle recette'}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Titre *</label>
            <input
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.title}
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              placeholder="Ma délicieuse recette"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800 resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              placeholder="Décrivez votre recette..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Catégorie *</label>
            <select
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.categoryId}
              onChange={(e) => onFormChange({ ...form, categoryId: e.target.value })}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Temps de préparation (minutes)</label>
            <input
              type="number"
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.prepTime ?? ''}
              onChange={(e) =>
                onFormChange({ ...form, prepTime: e.target.value ? parseInt(e.target.value) : null })
              }
              placeholder="ex: 20"
              min="0"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Difficulté</label>
            <select
              className="w-full border border-zinc-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-zinc-800"
              value={form.difficulty ?? ''}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  difficulty: e.target.value ? (e.target.value as 'Easy' | 'Medium' | 'Hard') : null,
                })
              }
            >
              <option value="">Sélectionnez la difficulté</option>
              <option value="Easy">Facile</option>
              <option value="Medium">Moyenne</option>
              <option value="Hard">Difficile</option>
            </select>
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 rounded-md border border-transparent bg-orange-600 text-white hover:bg-orange-500"
              onClick={onSubmit}
            >
              {isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

