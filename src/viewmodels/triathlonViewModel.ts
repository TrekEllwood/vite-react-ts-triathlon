import { useState, useEffect, useMemo } from 'react'
import { Triathlon } from '../models/triathlon'
import { Race } from '../models/race'
import { Participant } from '../models/participant'
import { RaceType } from '../types/raceType'
import { createRaceViewModel } from './raceViewModel'
import { createParticipantViewModel } from './participantViewModel'

export function useTriathlonViewModel() {
  const [triathlon, setTriathlon] = useState<Triathlon | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const t = loadTriathlon()
    setTriathlon(t)
  }, [])

  const forceUpdate = () => setVersion(v => v + 1)

  const addRace = (race: Race) => {
    triathlon?.addRace(race)
    forceUpdate()
  }

  const addOrUpdateParticipant = (updatedVM: ReturnType<typeof createParticipantViewModel>) => {
    const updated = updatedVM.getModel()
    const race = triathlon?.getAllRaces().find(r => r.id === updated.raceId)
    if (race) {
      const exists = race.participants.find(p => p.id === updated.id)
      if (!exists) {
        race.addParticipant(updated)
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
    addOrUpdateParticipant,
  }
}

function loadTriathlon(): Triathlon {
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
