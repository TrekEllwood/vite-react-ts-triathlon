import { useEffect, useState } from 'react'
import { ParticipantSummary } from './ParticipantSummary'
import { ParticipantRaceCard } from './ParticipantRaceCard'
import type { RaceViewModel } from '../viewmodels/raceViewModel'

interface RaceCardProps {
  race: RaceViewModel
  commit: () => void
  persist: () => void
  onGlobalResultAdded?: () => void
}

export function RaceCard({ race, commit, persist, onGlobalResultAdded }: RaceCardProps) {
  const {
    name,
    type,
    onResultAdded,
    getParticipants,
  } = race

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [bestTime, setBestTime] = useState<string | null>(race.bestTime ?? null)
  const [version, setVersion] = useState(0)
  const [localParticipants, setLocalParticipants] = useState(getParticipants())

  const selectedParticipant = localParticipants.find(p => p.id === selectedId)

  const refreshParticipants = () => {
    setVersion(v => v + 1)
  }

  useEffect(() => {
    const updated = getParticipants()
    setLocalParticipants(updated)

    const validTimes = updated
      .map(p => p.getFormattedTimeForRaceType(type))
      .filter(time => time !== '—')
      .sort()

    const newBest = validTimes[0] ?? null
    setBestTime(newBest)
  }, [version, getParticipants, type])

  const handleResultAdded = () => {
    commit()
    persist()
    onResultAdded()
    onGlobalResultAdded?.()
    refreshParticipants()
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 shadow dark:shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Type: {type}</p>
        <p className="text-sm text-green-600 dark:text-green-400">Best Time: {bestTime ?? '—'}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {localParticipants.map(p => (
          <ParticipantSummary
            key={p.id}
            fullName={p.fullName}
            formattedTime={p.getFormattedTimeForRaceType(type)}
            raceType={type}
            isSelected={selectedId === p.id}
            onSelect={() =>
              setSelectedId(prev => (prev === p.id ? null : p.id))
            }
          />
        ))}
      </div>

      {selectedParticipant && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <ParticipantRaceCard
            participant={selectedParticipant}
            raceType={type}
            onResultAdded={handleResultAdded}
          />
        </div>
      )}
    </div>
  )
}
