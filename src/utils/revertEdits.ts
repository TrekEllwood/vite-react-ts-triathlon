type DataObject = { [key: string]: unknown }

class RevertEdits<T extends DataObject> {
  private originalData: T
  private currentData: T
  private history: T[] = []
  private future: T[] = []
  private readonly stackLimit: number = 5

  constructor(initialData: T) {
    this.originalData = { ...initialData }
    this.currentData = { ...initialData }
  }

  // ADDED: for UI button hide
  canUndo(): boolean {
    return this.history.length > 0
  }

  // ADDED: for UI button hide
  canRedo(): boolean {
    return this.future.length > 0
  }

  /**
   * Updates the current data with new values.
   * Automatically pushes the previous state to the undo stack.
   */
  update(updatedData: Partial<T>): void {
    this.saveToHistory()
    this.currentData = { ...this.currentData, ...updatedData }
    this.future = [] // Clear redo stack after new change
  }

  /**
   * Reverts all changed fields back to their original values.
   * Only fields that were changed will be affected.
   */
  revert(): void {
    this.saveToHistory()
    for (const key in this.originalData) {
      if (this.currentData[key] !== this.originalData[key]) {
        this.currentData[key] = this.originalData[key]
      }
    }
    this.future = []
  }

  /**
   * Undo the most recent update/revert action.
   */
  undo(): void {
    if (this.history.length === 0) return
    this.future.unshift({ ...this.currentData })
    this.currentData = this.history.pop()!
  }

  /**
   * Redo the most recently undone action.
   */
  redo(): void {
    if (this.future.length === 0) return
    this.history.push({ ...this.currentData })
    this.currentData = this.future.shift()!
  }

  /**
   * Returns the current editable data.
   */
  getCurrentData(): T {
    return this.currentData
  }

  /**
   * Saves the current state to history with stack limit enforcement.
   */
  private saveToHistory(): void {
    this.history.push({ ...this.currentData })
    if (this.history.length > this.stackLimit) {
      this.history.shift() // Maintain stack size
    }
  }
}

export default RevertEdits
