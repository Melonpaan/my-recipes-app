/** Valide une quantité de stock (nombre ≥0, max 3 décimales) */
export function isValidStockQuantity(value: string): boolean {
  if (value.trim() === '') return false
  const num = Number(value)
  if (isNaN(num) || num < 0 || !isFinite(num)) return false
  const decimalPart = value.split('.')[1]
  if (decimalPart && decimalPart.length > 3) return false
  return true
}

