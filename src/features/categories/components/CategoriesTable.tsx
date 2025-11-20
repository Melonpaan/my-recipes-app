import type { CategoryDTO } from '../../../../shared/ipc'

interface Props {
  items: CategoryDTO[]
  onEdit: (item: CategoryDTO) => void
  onDelete: (id: string) => void
}

export function CategoriesTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-white/5">
      <table className="min-w-full text-sm">
        <thead className="bg-white/10">
          <tr>
            <th className="px-4 py-3 text-left text-zinc-700 dark:text-zinc-300">Nom</th>
            <th className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-zinc-600 dark:text-zinc-400" colSpan={2}>
                Aucune catégorie trouvée
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="border-t hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 text-zinc-900 dark:text-white">{item.name}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white mr-2 transition-colors"
                  onClick={() => onEdit(item)}
                >
                  Modifier
                </button>
                <button
                  className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 text-red-600 dark:text-red-400 transition-colors"
                  onClick={() => onDelete(item.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

