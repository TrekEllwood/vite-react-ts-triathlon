import { useState, useEffect, useMemo } from 'react'
import { Triathlon } from '../models/triathlon'
import { Race } from '../models/race'
import { Participant } from '../models/participant'
import { RaceType } from '../types/raceType'
import { createRaceViewModel } from './raceViewModel'
import { createParticipantViewModel, createParticipantViewModelFromData } from './participantViewModel'
import { StorageService } from '../utils/database/storageService'
import { TriathlonSerialiser } from '../utils/database/triathlonSerialiser'
import type { TriathlonDTO } from '../utils/database/triathlonSerialiser'
import { v4 as uuidv4 } from 'uuid'
import RevertEdits from '../utils/revertEdits'
import { toast } from 'sonner'

export function useTriathlonViewModel() {
  const [editor, setEditor] = useState<RevertEdits<TriathlonDTO> | null>(null)
  const [triathlon, setTriathlon] = useState<Triathlon | null>(null)
  const [, setVersion] = useState(0)

  const canUndo = editor?.canUndo() ?? false
  const canRedo = editor?.canRedo() ?? false

  useEffect(() => {
    const load = async () => {
      let dto = await StorageService.getFromLocalStorage<TriathlonDTO>('triathlon-1')
      if (!dto) {
        dto = await StorageService.getFromIndexedDB<TriathlonDTO>('triathlon-1')
      }

      if (!dto) {
        const newTriathlon = createDefaultTriathlon()
        dto = TriathlonSerialiser.serialise(newTriathlon)
        await StorageService.saveToLocalStorage('triathlon-1', dto)
        await StorageService.saveToIndexedDB('triathlon-1', dto)

        toast.info('A new event database has been created.')
      }

      setEditor(new RevertEdits(dto))
      setTriathlon(TriathlonSerialiser.deserialise(dto))
    }

    load()
  }, [])

  const forceUpdate = () => setVersion(v => v + 1)

  const persist = async () => {
    if (!editor) return
    const dto = editor.getCurrentData()
    await StorageService.saveToLocalStorage('triathlon-1', dto)
    await StorageService.saveToIndexedDB('triathlon-1', dto)
  }

  const commit = () => {
    if (!editor || !triathlon) return
    const dto = TriathlonSerialiser.serialise(triathlon)
    editor.update(dto)
    setTriathlon(TriathlonSerialiser.deserialise(dto))
    persist()
    forceUpdate()
  }

  const refreshFromEditor = () => {
    if (!editor) return
    const updated = TriathlonSerialiser.deserialise(editor.getCurrentData())
    setTriathlon(updated)
    forceUpdate()
    persist()
  }

  const addRace = (race: Race) => {
    if (!triathlon) return
    triathlon.addRace(race)
    commit()
  }

  const deleteRace = (raceId: string) => {
    if (!triathlon) return
    triathlon.deleteRace(raceId)
    commit()
  }

  const addParticipantIfNotExists = (updatedVM: ReturnType<typeof createParticipantViewModel>) => {
    if (!triathlon) return
    const updated = updatedVM.getModel()
    const race = triathlon.getAllRaces().find(r => r.id === updated.raceId)
    if (race) {
      const exists = race.participants.find(p => p.id === updated.id)
      if (!exists) {
        race.addParticipant(updated)
        commit()
      }
    }
  }

  const deleteParticipant = (participantId: string) => {
    if (!triathlon) return

    const races = triathlon.getAllRaces()
    for (const race of races) {
      race.deleteParticipant(participantId)
    }

    triathlon.deleteParticipant(participantId)

    commit()
  }

  const addRaceByDetails = (name: string, type: RaceType) => {
    if (!triathlon) return
    const race = new Race(uuidv4(), triathlon.id, name, type)
    triathlon.addRace(race)
    commit()
  }

  const addParticipantByDetails = (
    raceId: string,
    firstName: string,
    lastName: string,
    bibNumber?: number
  ) => {
    if (!triathlon) return

  const participantVM = createParticipantViewModelFromData(
    uuidv4(),
    raceId,
    firstName,
    lastName,
    bibNumber
  )

  const race = triathlon.getAllRaces().find(r => r.id === raceId)
    if (race) {
      race.addParticipant(participantVM.getModel())
      commit()
    }
  }

  const clearRaceTime = (participantId: string, raceType: RaceType) => {
    if (!triathlon) return

    const participant = triathlon.getAllParticipants().find(p => p.id === participantId)
    if (!participant) return

    const result = participant.results[0]
    if (result?.splitTimes?.[raceType] != null) {
      result.splitTimes = {
        ...result.splitTimes,
        [raceType]: 0,
      }
      result.updateFinishTime?.()
    }
    
    const race = triathlon.getAllRaces().find(r => r.type === raceType)
    race?.deleteParticipant(participantId)
    commit()
  }

  const undo = () => {
    editor?.undo()
    refreshFromEditor()
  }

  const redo = () => {
    editor?.redo()
    refreshFromEditor()
  }

  const revert = () => {
    editor?.revert()
    refreshFromEditor()
  }

  const races = useMemo(
    () => triathlon?.getAllRaces().map(createRaceViewModel) ?? [],
    [triathlon]
  )

  const participants = useMemo(
    () => triathlon?.getAllParticipants().map(createParticipantViewModel) ?? [],
    [triathlon]
  )

  const averageTime = useMemo(
  () => triathlon?.calculateAverageTimeForEvent() ?? 'N/A',
  [triathlon]
)

  return {
    triathlon,
    races: races,
    participants: participants,
    averageTime,
    addRace,
    deleteRace,
    addOrUpdateParticipant: addParticipantIfNotExists,
    deleteParticipant,
    addRaceByDetails,
    addParticipantByDetails,
    clearRaceTime,
    undo,
    redo,
    revert,
    canUndo,
    canRedo,
    commit,
    persist,
    forceUpdate,
  }
}

// Hardcoded testing data
function createDefaultTriathlon(): Triathlon {
  const triathlonId = '1'
  const triathlon = new Triathlon(triathlonId, 'Ironman', new Date(), 'NZ')

  const swimId = 'r1'
  const bikeId = 'r2'

  const swim = new Race(swimId, triathlonId, 'Swim Sprint', RaceType.SWIM)
  const bike = new Race(bikeId, triathlonId, 'Bike Course', RaceType.BIKE)
  
  triathlon.addRace(swim)
  triathlon.addRace(bike)
  
  const aliceId = 'p1'
  const bobId = 'p2'
  const aliceFirst = 'Alice'
  const aliceLast = 'Wonderland'
  const kyloFirst = 'Kylo'
  const kyloLast = 'Ren'
  
  const alice = new Participant(aliceId, swimId, aliceFirst, aliceLast)
  const kylo = new Participant(bobId, swimId, kyloFirst, kyloLast)
  
  swim.addParticipant(alice)
  swim.addParticipant(kylo)
  
  const aliceInBike = new Participant(aliceId, bikeId, aliceFirst, aliceLast)
  const kyloInBike = new Participant(bobId, bikeId, kyloFirst, kyloLast)
  
  bike.addParticipant(aliceInBike)
  bike.addParticipant(kyloInBike)

  return triathlon
}
