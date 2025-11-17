/**
 * Valide qu'une chaîne représente une quantité de stock valide.
 * 
 * Une quantité valide est :
 * - Un nombre positif ou zéro
 * - Avec un maximum de 3 décimales
 * 
 * @param value - La chaîne à valider
 * @returns `true` si la valeur est valide, `false` sinon
 * 
 * @example
 * ```ts
 * isValidStockQuantity("0")        // => true
 * isValidStockQuantity("123")      // => true
 * isValidStockQuantity("12.5")     // => true
 * isValidStockQuantity("500.125")  // => true
 * isValidStockQuantity("12.3456")  // => false (trop de décimales)
 * isValidStockQuantity("abc")      // => false (pas un nombre)
 * isValidStockQuantity("-5")       // => false (négatif)
 * isValidStockQuantity("")         // => false (vide)
 * ```
 */
export function isValidStockQuantity(value: string): boolean {
  // Vérifie que la valeur n'est pas vide
  if (value.trim() === '') return false
  
  // Convertit en nombre
  const num = Number(value)
  
  // Vérifie que c'est un nombre valide, positif, et pas NaN ou Infinity
  if (isNaN(num) || num < 0 || !isFinite(num)) return false
  
  // Vérifie le nombre de décimales (maximum 3)
  const decimalPart = value.split('.')[1]
  if (decimalPart && decimalPart.length > 3) return false
  
  return true
}

