import { useState } from 'react'
import { Race } from '../models/race'
import { Participant } from '../models/participant'
import { createParticipantViewModel, type ParticipantViewModel } from './participantViewModel'
import { RaceType } from '../types/raceType'
import { TimeUtils } from '../utils/timeUtils'

export type RaceViewModel = ReturnType<typeof useRaceViewModel>

// Function — no hooks
export function createRaceViewModel(race: Race) {
  return {
    id: race.id,
    name: race.name,
    type: race.type as RaceType,
    bestTime: race.bestTime,
    averageTime: race.calculateAverageTime(),
    
    getParticipants: () => race.participants.map(createParticipantViewModel),

    onResultAdded: () => race.updateBestTime(),
    addParticipant: (p: Participant) => race.addParticipant(p),
    deleteParticipant: (participantId: string) => {
      race.deleteParticipant(participantId)
    },
    sortParticipants: (order: 'best' | 'worst' = 'best') => {
      race.participants.sort((a, b) => {
        const timesA = a.results.map(r => TimeUtils.parseTime(r.finishTime)).filter(Boolean)
        const timesB = b.results.map(r => TimeUtils.parseTime(r.finishTime)).filter(Boolean)
        const timeA = order === 'best' ? Math.min(...timesA) : Math.max(...timesA)
        const timeB = order === 'best' ? Math.min(...timesB) : Math.max(...timesB)
        return order === 'best' ? timeA - timeB : timeB - timeA
      })
    },
    addParticipantToRace: (participantVM: ParticipantViewModel) => {
      race.addParticipant(participantVM.getModel())
    },
    removeParticipantFromRace: (participantId: string) => {
      race.deleteParticipant(participantId)
    },
    hasParticipants: () => race.participants.length > 0,
    getModel: () => race
  }
}

// Hook
export function useRaceViewModel(race: Race) {
  const [_, forceUpdate] = useState(0)
  const vm = createRaceViewModel(race)

  return {
    id: vm.id,
    name: vm.name,
    type: vm.type,
    bestTime: vm.bestTime,
    averageTime: vm.averageTime,

    getParticipants: vm.getParticipants,

    addParticipant: (p: Participant) => {
      vm.addParticipant(p)
      forceUpdate(v => v + 1)
    },
    deleteParticipant: (participantId: string) => {
      vm.deleteParticipant(participantId)
      forceUpdate(v => v + 1)
    },
    sortParticipants: (order: 'best' | 'worst' = 'best') => {
      vm.sortParticipants(order)
      forceUpdate(v => v + 1)
    },
    onResultAdded: () => {
      vm.onResultAdded()
      forceUpdate(v => v + 1)
    },
    getModel: vm.getModel,

    addParticipantToRace: (participantVM: ParticipantViewModel) => {
      vm.addParticipantToRace(participantVM)
      forceUpdate(v => v + 1)
    },
    removeParticipantFromRace: (participantId: string) => {
      vm.removeParticipantFromRace(participantId)
      forceUpdate(v => v + 1)
    },
    hasParticipants: vm.hasParticipants,
  }
}
