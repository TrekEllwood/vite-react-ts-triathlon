import { RaceType } from '../types/raceType'
import { TimeUtils } from '../utils/timeUtils'

export class Results {
  splitTimes: Partial<Record<RaceType, number>>
  position: number
  private _finishTime: string = '00:00:00'

  constructor(splitTimes: Partial<Record<RaceType, number>>, position: number = 0) {
    this.splitTimes = splitTimes
    this.position = position
    this.finishTime = ''
  }

  private calculateFinishTime(): string {
    const totalSeconds = Object.values(this.splitTimes).reduce((sum, time) => sum + (time || 0), 0)
    return TimeUtils.formatTime(totalSeconds)
  }

  // ADDED: to be called if a participants times change
  updateFinishTime(): void {
    this._finishTime = this.calculateFinishTime()
  }

  get finishTime(): string {
    return this._finishTime
  }

  set finishTime(value: string) {
    if (value) {
      this._finishTime = value
    } else {
      this._finishTime = this.calculateFinishTime()
    }
  }
}
