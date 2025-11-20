/** Convertit une quantité string → number avec valeur par défaut */
export function parseStockQty(value: string, defaultValue: number = 0): number {
  if (!value || value.trim() === '') return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

