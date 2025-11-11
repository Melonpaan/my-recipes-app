/**
 * Utility functions for type conversions
 */

/**
 * Converts stockQty from database Decimal (as string) to number for frontend use
 * @param value - The stock quantity as string or number
 * @returns The stock quantity as a number
 */
export function stockQtyToNumber(value: string | number): number {
  if (typeof value === 'number') return value
  return Number(value)
}

/**
 * Converts stockQty from number to string for database storage
 * @param value - The stock quantity as number
 * @returns The stock quantity as a string
 */
export function stockQtyToString(value: number): string {
  return value.toString()
}

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

