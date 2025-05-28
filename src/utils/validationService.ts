export class ValidationService {
  static isValidName(name: string): boolean {
    // return name.trim().length > 0 && !/^\d+$/.test(name) // letters and numbers
    // return name.trim().length > 0 && /^[A-Za-z]+$/.test(name) // Does not allow spaces
    return name.trim().length > 0 && /^[A-Za-z\s]+$/.test(name) // Allow letters and spaces
  }

  static isValidTimeFormat(time: string): boolean {
    const timeRegex = /^(\d{2}):(\d{2}):(\d{2})$/
    return timeRegex.test(time)
  }
}
