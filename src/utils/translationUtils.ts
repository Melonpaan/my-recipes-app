/** Traduit les niveaux de difficulté (enum DB → UI française) */
export function translateDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard' | null | undefined): string {
  if (!difficulty) return '-'
  const translations: Record<'Easy' | 'Medium' | 'Hard', string> = {
    Easy: 'Facile',
    Medium: 'Moyenne',
    Hard: 'Difficile',
  }
  return translations[difficulty] ?? difficulty
}

