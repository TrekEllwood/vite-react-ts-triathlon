type ErrorDisplayFn = (message: string) => void // Decouples UI display logic from the error handling logic.

export class ErrorHandler {
  private static errorDisplayFn: ErrorDisplayFn | null = null

    static setErrorDisplayFn(fn: ErrorDisplayFn): void {
    this.errorDisplayFn = fn
  }

  static throwInvalidTimeFormat(): never {
    throw new Error('Invalid time format. Expected HH:MM:SS')
  }

  static throwInvalidName(): never {
    throw new Error('Invalid name.')
  }

  static throwInvalidPosition(): never {
    throw new Error('Invalid position value')
  }

  static throwDuplicateRaceError(): never {
    throw new Error('Duplicate race ID.')
  }

  // ADDED: Simple UI error without context or throwing
  static showUserError(message: string): void {
    if (this.errorDisplayFn) {
      this.errorDisplayFn(message)
    }
  }

  /**
   * Handles unexpected errors, optionally displaying a user-friendly message.
   * Then throws a detailed error for logging/debugging purposes.
   * 
   * @param action - The action being performed (e.g., "load", "save").
   * @param key - A unique identifier related to the action (e.g., user ID, race ID).
   * @param error - The caught error or error message, if any.
   */
  static handleErrorMsg(action: string, key: string, error?: unknown): never {
    const errorMessage = `Failed to ${action} data with key: ${key}.`
    
    // Call the display function if one is set.
    if (this.errorDisplayFn) {
      this.errorDisplayFn(errorMessage)
    }
    
    if (error instanceof Error) {
      throw new Error(`${errorMessage} Error: ${error.message}`)
    } else if (typeof error === 'string') {
      throw new Error(`${errorMessage} Error: ${error}`)
    } else if (error) {
      throw new Error(`${errorMessage} Error: ${JSON.stringify(error)}`)
    } else {
      throw new Error(errorMessage)
    }
  }
}
