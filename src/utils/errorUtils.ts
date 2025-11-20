/** Extrait le message d'erreur utilisateur depuis les erreurs IPC Electron */
export function getErrorMessage(error: Error): string {
  const separator = ': Error: '
  const parts = error.message.split(separator)
  return parts.length > 1 ? parts[parts.length - 1] : error.message
}

