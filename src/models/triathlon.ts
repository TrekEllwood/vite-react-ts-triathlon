import { Race } from './race'
import { ValidationService } from '../utils/validationService'
import { ErrorHandler } from '../utils/errorHandler'
import { TimeUtils } from '../utils/timeUtils'
import type { Participant } from './participant'

export class Triathlon {
  id: string
  name: string
  date: Date
  location: string
  races: Race[] = []
  isFollowed: boolean = false

  constructor(id: string, name: string, date: Date, location: string) {
    this.id = id
    this.name = name
    this.date = date
    this.location = location
  }

  addRace(race: Race): void {
    if (!ValidationService.isValidName(race.name)) {
      ErrorHandler.throwInvalidName()
    }
    if (this.races.some(existingRace => existingRace.id === race.id)) {
      ErrorHandler.throwDuplicateRaceError()
    }
    this.races.push(race)
  }

  getAllRaces(): Race[] {
    return this.races
  }

  deleteRace(raceId: string): void {
    this.races = this.races.filter(race => race.id !== raceId)
  }

  // ADDED: to get all participants across all races deduplicated
  getAllParticipants(): Participant[] {
    const all = this.races.flatMap(race => race.participants)
    const seen = new Map<string, Participant>()
    all.forEach(p => {
      if (!seen.has(p.id)) {
        seen.set(p.id, p)
      }
    })
    return Array.from(seen.values())
  }

  // ADDED: to make a cleaner way to access derived value
  get averageTime(): string | null {
    return this.calculateAverageTimeForEvent()
  }

  // Used to determine average event time, could be displayed in desc order of shortest events
  calculateAverageTimeForEvent(): string | null {
    const allTimes: number[] = []

    this.races.forEach(race => {
      const averageTime = race.calculateAverageTime()
      if (averageTime) {
        const parsedTime = TimeUtils.parseTime(averageTime)
        if (parsedTime !== null && parsedTime > 0) { // CHANGED: parsed > 0 to filter out 0 or invalid durations
          allTimes.push(parsedTime)
        }
      }
    })

    if (allTimes.length === 0) return null

    const totalInSeconds = allTimes.reduce((sum, time) => sum + time, 0)
    return TimeUtils.formatTime(totalInSeconds / allTimes.length)
  }
}
