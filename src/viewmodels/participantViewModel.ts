import { Participant } from '../models/participant'
import { TimeUtils } from '../utils/timeUtils'
import { RaceType } from '../types/raceType'

export type ParticipantViewModel = ReturnType<typeof createParticipantViewModel>

export function createParticipantViewModel(participant: Participant) {
  return {
    id: participant.id,
    fullName: participant.getFullName(),
    bibNumber: participant.bibNumber,

    // Dynamically calculate total time from model
    getTotalTime: (): string => participant.getTotalTime(),

    hasResultForRaceType: (raceType: RaceType): boolean =>
      participant.results.some(r => r.splitTimes[raceType] !== undefined),

    getFormattedTimeForRaceType: (raceType: RaceType): string => {
      const result = participant.results.find(r => r.splitTimes[raceType] !== undefined)
      const seconds = result?.splitTimes?.[raceType]
      return seconds !== undefined ? TimeUtils.formatTime(seconds) : '—'
    },

    addResultForRaceType: (
      raceType: RaceType,
      hours: string,
      minutes: string,
      seconds: string,
      position: number
    ): void => {
      const h = hours || '0'
      const m = minutes || '0'
      const s = seconds || '0'
      const formattedTime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`

      participant.addResult({ [raceType]: formattedTime }, position)
      participant.updateFinishTime()
    },

    // Expose the raw model
    getModel: (): Participant => participant
  }
}

export function createParticipantViewModelFromData(
  id: string,
  raceId: string,
  firstName: string,
  lastName: string,
  bibNumber?: number
): ParticipantViewModel {
  const model = new Participant(id, raceId, firstName, lastName, bibNumber)
  return createParticipantViewModel(model)
}
