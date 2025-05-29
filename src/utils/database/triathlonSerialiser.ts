import { Triathlon } from '../../models/triathlon'
import { Race } from '../../models/race'
import { Participant } from '../../models/participant'
import { Results } from '../../models/results'
import { RaceType } from '../../types/raceType'

// DTO (Data Transfer Object) types
export type ResultDTO = {
  splitTimes: Record<string, number>
  position: number
  finishTime: string
}

export type ParticipantDTO = {
  id: string
  raceId: string
  firstName: string
  lastName: string
  bibNumber?: number
  isFollowed: boolean
  results: ResultDTO[]
}

export type RaceDTO = {
  id: string
  triathlonId: string
  name: string
  type: RaceType
  isFollowed: boolean
  participants: ParticipantDTO[]
}

export type TriathlonDTO = {
  id: string
  name: string
  date: string
  location: string
  isFollowed: boolean
  races: RaceDTO[]
}

export class TriathlonSerialiser {
  static serialise(triathlon: Triathlon): TriathlonDTO {
    return {
      id: triathlon.id,
      name: triathlon.name,
      date: triathlon.date.toISOString(),
      location: triathlon.location,
      isFollowed: triathlon.isFollowed,
      races: triathlon.races.map(race => TriathlonSerialiser.mapRaceToDTO(race)),
    }
  }

  // CHANGE: to correct participant deserialisation
  static deserialise(data: TriathlonDTO): Triathlon {
    const triathlon = new Triathlon(data.id, data.name, new Date(data.date), data.location)
    triathlon.isFollowed = data.isFollowed
    // triathlon.races = data.races.map(raceData => TriathlonSerialiser.mapDTOToRace(raceData))
    
    const participantMap = this.buildSharedParticipantMap(data.races)

    triathlon.races = data.races.map(raceData =>
      this.rebuildRaceFromDTO(raceData, participantMap)
    )

    return triathlon
  }

  private static mapRaceToDTO(race: Race): RaceDTO {
    return {
      id: race.id,
      triathlonId: race.triathlonId,
      name: race.name,
      type: race.type,
      isFollowed: race.isFollowed,
      participants: race.participants.map(participant =>
        TriathlonSerialiser.mapParticipantToDTO(participant)
      ),
    }
  }

  private static mapParticipantToDTO(participant: Participant): ParticipantDTO {
    return {
      id: participant.id,
      raceId: participant.raceId,
      firstName: participant.firstName,
      lastName: participant.lastName,
      bibNumber: participant.bibNumber,
      isFollowed: participant.isFollowed,
      results: participant.results.map(result =>
        TriathlonSerialiser.mapResultToDTO(result)
      ),
    }
  }

  private static mapResultToDTO(result: Results): ResultDTO {
    return {
      splitTimes: result.splitTimes,
      position: result.position,
      finishTime: result.finishTime,
    }
  }

  // DELETED: becasue moved to inline .deserialise()
  // private static mapDTOToRace(raceData: RaceDTO): Race {
  //   const race = new Race(raceData.id, raceData.triathlonId, raceData.name, raceData.type)
  //   race.isFollowed = raceData.isFollowed
  //   race.participants = raceData.participants.map(participantData =>
  //     TriathlonSerialiser.mapDTOToParticipant(participantData)
  //   )
  //   return race
  // }

  private static mapDTOToParticipant(participantData: ParticipantDTO): Participant {
    const participant = new Participant(
      participantData.id,
      participantData.raceId,
      participantData.firstName,
      participantData.lastName,
      participantData.bibNumber
    )
    participant.isFollowed = participantData.isFollowed
    participant.results = participantData.results.map(resultData =>
      TriathlonSerialiser.mapDTOToResult(resultData)
    )
    return participant
  }

  private static mapDTOToResult(resultData: ResultDTO): Results {
    const splitTimes: Partial<Record<RaceType, number>> = {}
    for (const [key, val] of Object.entries(resultData.splitTimes)) {
      if (TriathlonSerialiser.isRaceType(key)) {
        splitTimes[key] = val
      }
    }
    // return new Results(splitTimes, resultData.position)
    // CHANGE: becasue finishTime was never restored
    const result = new Results(splitTimes, resultData.position)
    result.finishTime = resultData.finishTime
    return result
  }

  private static isRaceType(value: string): value is RaceType {
    return Object.values(RaceType).includes(value as RaceType)
  }

  // NEW: helper method
  private static buildSharedParticipantMap(races: RaceDTO[]): Map<string, Participant> {
    const map = new Map<string, Participant>()
    for (const race of races) {
      for (const pDTO of race.participants) {
        if (!map.has(pDTO.id)) {
          map.set(pDTO.id, this.mapDTOToParticipant(pDTO))
        }
      }
    }
    return map
  }

  // NEW: helper method
  private static rebuildRaceFromDTO(raceData: RaceDTO, participantMap: Map<string, Participant>): Race {
    const race = new Race(raceData.id, raceData.triathlonId, raceData.name, raceData.type)
    race.isFollowed = raceData.isFollowed

    race.participants = raceData.participants.map(pDTO => {
      const participant = participantMap.get(pDTO.id)
      if (!participant) {
        throw new Error(`Missing shared participant for ID: ${pDTO.id}`)
      }
      return participant
    })

    return race
  }
}
