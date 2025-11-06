type Ingredient = {
  id: string
  name: string
  unitId: string
  stockQty: string
}

type IngredientsTableProps = {
  items: Ingredient[]
  unitIdToCode: Map<string, string>
  onEdit: (item: Ingredient) => void
  onDelete: (id: string) => void
}

export function IngredientsTable({ items, unitIdToCode, onEdit, onDelete }: IngredientsTableProps) {
  return (
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
          {items.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center" colSpan={4}>
                No ingredients
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">{unitIdToCode.get(item.unitId) ?? item.unitId}</td>
              <td className="px-4 py-3 text-right">{item.stockQty}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 mr-2"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10 text-red-400"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

