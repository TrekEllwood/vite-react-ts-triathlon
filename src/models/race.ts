import type { RaceType } from '../types/raceType'
import { Participant } from './participant'
import { TimeUtils } from '../utils/timeUtils'
import { ValidationService } from '../utils/validationService'
import { ErrorHandler } from '../utils/errorHandler'

export class Race {
  id: string
  triathlonId: string
  name: string
  type: RaceType
  participants: Participant[] = []
  bestTime?: string
  isFollowed: boolean = false

  constructor(id: string, triathlonId: string, name: string, type: RaceType) {
    this.id = id
    this.triathlonId = triathlonId
    this.name = name
    this.type = type
  }

  addParticipant(participant: Participant): void {
    if (!ValidationService.isValidName(participant.firstName) || !ValidationService.isValidName(participant.lastName)) {
      ErrorHandler.throwInvalidName()
    }
    this.participants.push(participant)
    this.updateBestTime()
  }

  deleteParticipant(participantId: string): void {
    this.participants = this.participants.filter(p => p.id !== participantId)
    this.updateBestTime()
  }

  findParticipantByName(fullName: string): Participant | undefined {
    return this.participants.find(p => p.getFullName().toLowerCase() === fullName.toLowerCase())
  }

  updateBestTime(): void {
    const allTimes = this.participants
      .flatMap(p => p.results.map(r => TimeUtils.parseTime(r.finishTime)))
      .filter(time => time !== null)

    if (allTimes.length > 0) {
      const bestTimeInSeconds = Math.min(...allTimes)
      this.bestTime = TimeUtils.formatTime(bestTimeInSeconds)
    } else {
      this.bestTime = undefined
    }
  }

  sortParticipantsByTime(): void {
    this.participants.sort((a, b) => {
      const timeA = Math.min(...a.results.map(r => TimeUtils.parseTime(r.finishTime)))
      const timeB = Math.min(...b.results.map(r => TimeUtils.parseTime(r.finishTime)))
      return timeA - timeB
    })
  }

  calculateAverageTime(): string | null {
    if (this.participants.length === 0) return null
    const totalInSeconds = this.participants.reduce((sum, p) => {
      const bestTime = Math.min(
        ...p.results.map(r => TimeUtils.parseTime(r.finishTime))
      )
      return sum + (isFinite(bestTime) ? bestTime : 0)
    }, 0)
    const averageInSeconds = totalInSeconds / this.participants.length
    return TimeUtils.formatTime(averageInSeconds)
  }

  calculateAverageTimeForRaceType(raceType: RaceType): string | null {
    const times = this.participants
      .map(p => p.results.find(r => r.splitTimes[raceType] !== undefined)?.splitTimes[raceType])
      .filter(time => time !== undefined) as number[]

    if (times.length === 0) return null

    const totalInSeconds = times.reduce((sum, time) => sum + time, 0)
    return TimeUtils.formatTime(totalInSeconds / times.length)
  }
}
