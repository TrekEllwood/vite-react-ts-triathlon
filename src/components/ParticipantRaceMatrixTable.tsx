import { clearAppBadge } from '@/utils/badgeUtils'
import { generateCSVFromParticipantRaceMatrix, saveCSVToFile } from '../utils/exportToCSV'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'
import type { RaceViewModel } from '../viewmodels/raceViewModel'
import { Bell, BellDot } from 'lucide-react'

interface Props {
  participants: ParticipantViewModel[]
  races: RaceViewModel[]
  sortMode: 'none' | 'best' | 'worst'
  onSortModeChange: (mode: 'none' | 'best' | 'worst') => void
  hasNewResults: boolean
  onClearNewResults: () => void
}

export function ParticipantRaceMatrixTable({
  participants,
  races,
  sortMode,
  onSortModeChange,
  hasNewResults,
  onClearNewResults,
}: Props) {
  const sortedParticipants = [...participants]

  if (sortMode === 'best') {
    sortedParticipants.sort((a, b) =>
      a.getTotalTime() < b.getTotalTime() ? -1 : 1
    )
  } else if (sortMode === 'worst') {
    sortedParticipants.sort((a, b) =>
      a.getTotalTime() > b.getTotalTime() ? -1 : 1
    )
  }

  return (
    <div className="overflow-x-auto mt-6">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => {
            onClearNewResults()
            clearAppBadge()
          }}
          className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Acknowledge new results"
        >
          {hasNewResults ? (
            <BellDot className="w-5 h-5 text-orange-400" />
          ) : (
            <Bell className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onSortModeChange(
                sortMode === 'none' ? 'best' : sortMode === 'best' ? 'worst' : 'none'
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
              : `Sorted by ${sortMode === 'best' ? 'Best Total' : 'Worst Total'}`}
          </button>

          <button
            onClick={() => {
              const csv = generateCSVFromParticipantRaceMatrix(participants, races)
              saveCSVToFile(csv)
            }}
            className="text-sm px-3 py-1 border rounded bg-green-600 text-white hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <table className="min-w-full text-sm text-left border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border-b">Name</th>
            {races.map(race => (
              <th key={race.id} className="p-2 border-b">
                {race.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map(p => {
            return (
              <tr key={p.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="p-2 border-b">{p.fullName}</td>
                {races.map(race => {
                  const formatted = p.getFormattedTimeForRaceType(race.type)
                  return (
                    <td key={race.id} className="p-2 border-b">
                      {formatted}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
