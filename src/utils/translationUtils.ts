/**
 * Utilitaires de traduction pour les valeurs de l'interface utilisateur
 */

/**
 * Traduit les niveaux de difficulté de l'anglais (base de données) vers le français (UI)
 * 
 * @param difficulty - Le niveau de difficulté en anglais
 * @returns Le niveau de difficulté traduit en français
 * 
 * @example
 * ```ts
 * translateDifficulty("Easy")    // => "Facile"
 * translateDifficulty("Medium")  // => "Moyenne"
 * translateDifficulty("Hard")    // => "Difficile"
 * translateDifficulty(null)      // => "-"
 * ```
 */
export function translateDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard' | null | undefined): string {
  if (!difficulty) return '-'
  
  const translations: Record<'Easy' | 'Medium' | 'Hard', string> = {
    Easy: 'Facile',
    Medium: 'Moyenne',
    Hard: 'Difficile',
  }
  
  return translations[difficulty] ?? difficulty
}

