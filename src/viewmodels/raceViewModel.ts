import { useState } from 'react'
import { Race } from '../models/race'
import { Participant } from '../models/participant'
import { createParticipantViewModel, type ParticipantViewModel } from './participantViewModel'
import { RaceType } from '../types/raceType'

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
    sortParticipantsByTime: () => {
      race.sortParticipantsByTime()
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
  const [, forceUpdate] = useState(0)
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
    sortParticipantsByTime: () => {
      vm.sortParticipantsByTime()
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
