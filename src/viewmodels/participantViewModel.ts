import { Participant } from '../models/participant'
import { TimeUtils } from '../utils/timeUtils'
import { RaceType } from '../types/raceType'

export type ParticipantViewModel = ReturnType<typeof createParticipantViewModel>

// Pure function — safe to use anywhere
export function createParticipantViewModel(participant: Participant) {
  return {
    id: participant.id,

    fullName: participant.getFullName(),

    bibNumber: participant.bibNumber,

    // Dynamically calculate total time from model
    getTotalTime: (): string => participant.getTotalTime(),

    // Check if the participant has a result for a specific race type
    hasResultForRaceType: (raceType: RaceType): boolean =>
      participant.results.some(r => r.splitTimes[raceType] !== undefined),

    // Get formatted result time for a given race type
    getFormattedTimeForRaceType: (raceType: RaceType): string => {
      const result = participant.results.find(r => r.splitTimes[raceType] !== undefined)
      const seconds = result?.splitTimes?.[raceType]
      return seconds !== undefined ? TimeUtils.formatTime(seconds) : '—'
    },

    // Add a result to the participant
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

    // Expose the raw model if needed
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
