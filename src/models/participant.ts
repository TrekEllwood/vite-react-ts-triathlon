import type { RaceType } from '../types/raceType'
import { Results } from './results'
import { TimeUtils } from '../utils/timeUtils'
import { ValidationService } from '../utils/validationService'
import { ErrorHandler } from '../utils/errorHandler'


export class Participant {
  id: string
  raceId: string
  firstName: string
  lastName: string
  bibNumber?: number
  results: Results[] = []
  isFollowed: boolean = false

  constructor(id: string, raceId: string, firstName: string, lastName: string, bibNumber?: number) {
    this.id = id
    this.raceId = raceId
    this.firstName = firstName
    this.lastName = lastName
    this.bibNumber = bibNumber
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  // addResult(raceTimes: Partial<Record<RaceType, string>>, position: number): void {
  //   for (const [, value] of Object.entries(raceTimes)) {
  //     if (!ValidationService.isValidTimeFormat(value)) {
  //       ErrorHandler.throwInvalidTimeFormat()
  //     }
  //   }
  //   const splitTimes = this.convertRaceTimes(raceTimes)
  //   const result = new Results(splitTimes, position)
  //   this.results.push(result)
  // }

  // UPDATED: to only allow single result object
  addResult(raceTimes: Partial<Record<RaceType, string>>, position: number): void {
  for (const [, value] of Object.entries(raceTimes)) {
    if (!ValidationService.isValidTimeFormat(value)) {
      ErrorHandler.throwInvalidTimeFormat()
    }
  }

  const splitTimes = this.convertRaceTimes(raceTimes)

  let result: Results

  if (this.results.length === 0) {
    result = new Results(splitTimes, position)
    this.results.push(result)
  } else {
    result = this.results[0]
    result.splitTimes = {
      ...result.splitTimes,
      ...splitTimes // Overwrite old race type time
    }
    result.position = position
    result.updateFinishTime()
  }
}

  getTotalTime(): string {
    if (this.results.length === 0) return '00:00:00'

    const totalInSeconds = this.results.reduce((sum, result) => {
      return sum + (result.finishTime ? TimeUtils.parseTime(result.finishTime) : 0)
    }, 0)

    return TimeUtils.formatTime(totalInSeconds)
  }

  updateFinishTime(): void {
    if (this.results.length > 0) {
      this.results[0].updateFinishTime()
    }
  }

  private convertRaceTimes(raceTimes: Partial<Record<RaceType, string>>): Partial<Record<RaceType, number>> {
    const splitTimes: Partial<Record<RaceType, number>> = {}

    for (const [raceType, time] of Object.entries(raceTimes) as [RaceType, string][]) {
      if (!ValidationService.isValidTimeFormat(time)) {
        ErrorHandler.throwInvalidTimeFormat()
      }
      splitTimes[raceType] = TimeUtils.parseTime(time)
    }

    return splitTimes
  }
}
