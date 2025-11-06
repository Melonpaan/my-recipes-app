/**
 * Custom application error class for consistent error handling
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  static notFound(resource: string, id?: string): AppError {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`
    return new AppError(message, 'NOT_FOUND', 404)
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 400, details)
  }

  static conflict(message: string): AppError {
    return new AppError(message, 'CONFLICT', 409)
  }

  static foreignKeyViolation(message: string): AppError {
    return new AppError(message, 'FOREIGN_KEY_VIOLATION', 409)
  }

  static database(message: string, details?: unknown): AppError {
    return new AppError(message, 'DATABASE_ERROR', 500, details)
  }
}

