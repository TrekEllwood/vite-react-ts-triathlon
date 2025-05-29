import { useState, useEffect, useMemo } from 'react'
import { Triathlon } from '../models/triathlon'
import { Race } from '../models/race'
import { Participant } from '../models/participant'
import { RaceType } from '../types/raceType'
import { createRaceViewModel } from './raceViewModel'
import { createParticipantViewModel } from './participantViewModel'
import { StorageService } from '../utils/database/storageService'
import { TriathlonSerialiser } from '../utils/database/triathlonSerialiser'
import type { TriathlonDTO } from '../utils/database/triathlonSerialiser'

export function useTriathlonViewModel() {
  const [triathlon, setTriathlon] = useState<Triathlon | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const load = async () => {
      // const dto = await StorageService.getFromIndexedDB<TriathlonDTO>('triathlon-1')
      let dto = await StorageService.getFromLocalStorage<TriathlonDTO>('triathlon-1')
      if (!dto) {
        dto = await StorageService.getFromIndexedDB<TriathlonDTO>('triathlon-1')
      }

      if (dto) {
        setTriathlon(TriathlonSerialiser.deserialise(dto))
      } else {
        const newTriathlon = createDefaultTriathlon()
        const serialised = TriathlonSerialiser.serialise(newTriathlon)
        
        // await StorageService.saveToIndexedDB('triathlon-1', TriathlonSerialiser.serialise(newTriathlon))
        await StorageService.saveToLocalStorage('triathlon-1', serialised)
        await StorageService.saveToIndexedDB('triathlon-1', serialised)

        setTriathlon(newTriathlon)
      }
    }
    load()
  }, [])

  const forceUpdate = () => setVersion(v => v + 1)

  const persist = async () => {
    if (!triathlon) return
    const dto = TriathlonSerialiser.serialise(triathlon)
    await StorageService.saveToLocalStorage('triathlon-1', dto)
    await StorageService.saveToIndexedDB('triathlon-1', dto)
  }

  const addRace = (race: Race) => {
    if (!triathlon) return
    triathlon.addRace(race)
    persist()
    forceUpdate()
  }

  const deleteRace = (raceId: string) => {
    if (!triathlon) return
    triathlon.deleteRace(raceId)
    persist()
    forceUpdate()
  }

  const addOrUpdateParticipant = (updatedVM: ReturnType<typeof createParticipantViewModel>) => {
    if (!triathlon) return
    const updated = updatedVM.getModel()
    const race = triathlon.getAllRaces().find(r => r.id === updated.raceId)
    if (race) {
      const exists = race.participants.find(p => p.id === updated.id)
      if (!exists) {
        race.addParticipant(updated)
        persist()
        forceUpdate()
      }
    }
  }

  const racesVM = useMemo(
    () => triathlon?.getAllRaces().map(createRaceViewModel) ?? [],
    [triathlon, version]
  )

  const participantsVM = useMemo(
    () => triathlon?.getAllParticipants().map(createParticipantViewModel) ?? [],
    [triathlon, version]
  )

  const averageTime = useMemo(
    () => triathlon?.calculateAverageTimeForEvent() ?? 'N/A',
    [triathlon, version]
  )

  return {
    triathlon: triathlon
      ? {
          name: triathlon.name,
          location: triathlon.location,
        }
      : null,
    races: racesVM,
    participants: participantsVM,
    // averageTime: triathlon?.calculateAverageTimeForEvent() ?? 'N/A',
    averageTime,
    addRace,
    deleteRace,
    addOrUpdateParticipant,
    persist,
  }
}

function createDefaultTriathlon(): Triathlon {
  const triathlon = new Triathlon('1', 'Ironman', new Date(), 'NZ')

  const swim = new Race('r1', '1', 'Swim Sprint', RaceType.SWIM)
  const bike = new Race('r2', '1', 'Bike Course', RaceType.BIKE)

  const p1 = new Participant('p1', swim.id, 'Alice', 'Smith')
  const p2 = new Participant('p2', swim.id, 'Bob', 'Johnson')

  swim.addParticipant(p1)
  swim.addParticipant(p2)
  bike.addParticipant(p1)
  bike.addParticipant(p2)

  triathlon.addRace(swim)
  triathlon.addRace(bike)

  return triathlon
}
