import { useEffect, useState } from 'react'
import { ParticipantSummary } from './ParticipantSummary'
import { ParticipantRaceCard } from './ParticipantRaceCard'
import type { RaceViewModel } from '../viewmodels/raceViewModel'

interface RaceCardProps {
  race: RaceViewModel
}

export function RaceCard({ race }: RaceCardProps) {
  const {
    name,
    type,
    onResultAdded,
    sortParticipants,
    getParticipants,
  } = race

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [bestTime, setBestTime] = useState<string | null>(race.bestTime ?? null)
  const [sortMode, setSortMode] = useState<'none' | 'best' | 'worst'>('none')
  const [version, setVersion] = useState(0)
  const [localParticipants, setLocalParticipants] = useState(getParticipants())

  const selectedParticipant = localParticipants.find(p => p.id === selectedId)

  const refreshParticipants = () => {
    setVersion(v => v + 1)
  }

  useEffect(() => {
    if (sortMode === 'none') {
      setLocalParticipants(getParticipants())
    } else {
      sortParticipants(sortMode)
      setLocalParticipants(getParticipants())
    }
  }, [sortMode, version])

  const handleResultAdded = () => {
    onResultAdded()
    refreshParticipants()

    const validTimes = localParticipants
      .map(p => p.getFormattedTimeForRaceType(type))
      .filter(Boolean)

    const newBest = validTimes.sort()[0] ?? null
    setBestTime(newBest)
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Type: {type}</p>
        <p className="text-sm text-green-600 dark:text-green-400">Best Time: {bestTime ?? '—'}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSortMode(prev =>
              prev === 'none' ? 'best' : prev === 'best' ? 'worst' : 'none'
            )
          }}
          className="text-sm px-3 py-1 border rounded dark:border-gray-600 dark:text-gray-200 flex items-center gap-2"
        >
          <span>
            {sortMode === 'none' && '⇅'}
            {sortMode === 'best' && '↑'}
            {sortMode === 'worst' && '↓'}
          </span>
          {sortMode === 'none'
            ? 'Unsorted'
            : `Sorted by ${sortMode === 'best' ? 'Best Times' : 'Worst Times'}`}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {localParticipants.map(p => (
          <ParticipantSummary
            key={p.id}
            fullName={p.fullName}
            formattedTime={p.getFormattedTimeForRaceType(type)}
            raceType={type}
            onSelect={() => setSelectedId(p.id)}
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
