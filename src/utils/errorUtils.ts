/**
 * Extrait le message d'erreur propre depuis les erreurs IPC Electron.
 * 
 * Les erreurs IPC Electron ont le format:
 * "Error invoking remote method 'channel:name': Error: actual message"
 * 
 * Cette fonction extrait seulement "actual message" pour l'afficher à l'utilisateur.
 * Si le message n'est pas au format IPC, retourne le message original.
 * 
 * @param error - L'erreur à parser
 * @returns Le message d'erreur propre
 * 
 * @example
 * ```ts
 * const error = new Error("Error invoking remote method 'categories:create': Error: Une catégorie existe déjà")
 * getErrorMessage(error) // => "Une catégorie existe déjà"
 * ```
 */
export function getErrorMessage(error: Error): string {
  const separator = ': Error: '
  const parts = error.message.split(separator)
  
  // Si on trouve le séparateur, prendre la dernière partie
  // Sinon, retourner le message original
  return parts.length > 1 ? parts[parts.length - 1] : error.message
}

