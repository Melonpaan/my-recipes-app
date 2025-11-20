/**
 * Utility functions for type conversions
 */

/**
 * Parses stockQty from form input (string) to number
 * Handles empty strings and invalid inputs gracefully
 * @param value - The input value from form
 * @param defaultValue - Default value if parsing fails (default: 0)
 * @returns The parsed number or default value
 */
export function parseStockQty(value: string, defaultValue: number = 0): number {
  if (!value || value.trim() === '') return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

