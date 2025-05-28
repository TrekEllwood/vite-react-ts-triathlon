import { ValidationService } from './validationService'
import { ErrorHandler } from './errorHandler'

export class TimeUtils {
  static parseTime(time: string): number {
    if (!ValidationService.isValidTimeFormat(time)) {
      ErrorHandler.throwInvalidTimeFormat()
    }

    const [hours, minutes, seconds] = time.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}
