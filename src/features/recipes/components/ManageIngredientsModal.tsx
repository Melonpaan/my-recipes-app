import { useState, useMemo, useEffect } from 'react'
import type { IngredientDTO, RecipeIngredientDTO } from '../../../../shared/ipc'

type IngredientFormItem = {
  ingredientId: string
  quantity: string
}

type ManageIngredientsModalProps = {
  isOpen: boolean
  recipeTitle: string
  currentIngredients: RecipeIngredientDTO[]
  availableIngredients: IngredientDTO[]
  unitIdToCode: Map<string, string>
  onSave: (ingredients: Array<{ ingredientId: string; quantity: number }>) => void
  onCancel: () => void
}

export function ManageIngredientsModal({
  isOpen,
  recipeTitle,
  currentIngredients,
  availableIngredients,
  unitIdToCode,
  onSave,
  onCancel,
}: ManageIngredientsModalProps) {
  const [items, setItems] = useState<IngredientFormItem[]>([])

  useEffect(() => {
    if (isOpen) {
      setItems(
        currentIngredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
        }))
      )
    }
  }, [isOpen, currentIngredients])

  const [selectedIngredientId, setSelectedIngredientId] = useState('')

  const availableOptions = useMemo(() => {
    const usedIds = new Set(items.map((i) => i.ingredientId))
    return availableIngredients.filter((ing) => !usedIds.has(ing.id))
  }, [items, availableIngredients])

  function handleAdd() {
    if (!selectedIngredientId) return
    setItems([...items, { ingredientId: selectedIngredientId, quantity: '1' }])
    setSelectedIngredientId('')
  }

  function handleRemove(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function handleQuantityChange(index: number, value: string) {
    const updated = [...items]
    updated[index].quantity = value
    setItems(updated)
  }

  function handleSave() {
    // Validation basique
    const valid = items.every((item) => {
      const qty = parseFloat(item.quantity)
      return !isNaN(qty) && qty > 0
    })

    if (!valid) {
      alert('Toutes les quantités doivent être des nombres positifs valides')
      return
    }

    // Convertir en format attendu
    const payload = items.map((item) => ({
      ingredientId: item.ingredientId,
      quantity: parseFloat(item.quantity),
    }))

    onSave(payload)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-xl shadow-lg p-6 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-1">Gérer les ingrédients</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
          Recette : <span className="font-medium">{recipeTitle}</span>
        </p>

        {/* Liste des ingrédients */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Liste des ingrédients</h3>
          {items.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center border border-dashed border-white/20 rounded-md">
              Aucun ingrédient pour le moment. Ajoutez-en un ci-dessous.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => {
                const ingredient = availableIngredients.find((ing) => ing.id === item.ingredientId)
                const unitCode = ingredient ? unitIdToCode.get(ingredient.unitId) : ''
                return (
                  <div key={index} className="flex items-center gap-3 p-3 border border-white/20 rounded-md">
                    <div className="flex-1">
                      <span className="font-medium">{ingredient?.name ?? 'Inconnu'}</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-24 px-2 py-1 border border-zinc-300 dark:border-white/20 rounded-md bg-white dark:bg-zinc-800 text-center"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      placeholder="Qté"
                    />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 w-10">{unitCode}</span>
                    <button
                      className="px-3 py-1 text-sm rounded-md border border-red-500/50 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleRemove(index)}
                    >
                      Retirer
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ajouter un ingrédient */}
        <div className="mb-6 p-4 border border-white/20 rounded-md bg-zinc-50 dark:bg-zinc-800/50">
          <h3 className="text-sm font-medium mb-2">Ajouter un ingrédient</h3>
          <div className="flex gap-2">
            <select
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-white/20 rounded-md bg-white dark:bg-zinc-800"
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
            >
              <option value="">Sélectionnez un ingrédient...</option>
              {availableOptions.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({unitIdToCode.get(ing.unitId)})
                </option>
              ))}
            </select>
            <button
              className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdd}
              disabled={!selectedIngredientId}
            >
              + Ajouter
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10"
              onClick={onCancel}
            >
              Annuler
            </button>
          <button
            className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500"
            onClick={handleSave}
          >
            Enregistrer les ingrédients
          </button>
        </div>
      </div>
    </div>
  )
}

