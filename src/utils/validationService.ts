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

  // ADDED: for time input checking
  static isValidTimeSegments(hours: string, minutes: string, seconds: string): boolean {
    const h = parseInt(hours || '0', 10)
    const m = parseInt(minutes || '0', 10)
    const s = parseInt(seconds || '0', 10)
    return (
      !isNaN(h) && h >= 0 && h <= 59 &&
      !isNaN(m) && m >= 0 && m <= 59 &&
      !isNaN(s) && s >= 0 && s <= 59
    )
  }
}
