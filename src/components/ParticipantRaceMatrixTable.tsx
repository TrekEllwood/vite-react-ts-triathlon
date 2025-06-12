import { clearAppBadge } from '@/utils/badgeUtils'
import { generateCSVFromParticipantRaceMatrix, saveCSVToFile } from '../utils/exportToCSV'
import { sortParticipantViewModelsByTotalTime, type ParticipantViewModel } from '../viewmodels/participantViewModel'
import type { RaceViewModel } from '../viewmodels/raceViewModel'
import { Bell, BellDot } from 'lucide-react'
import { SortOrder } from '@/types/sortOrder'
import { useState } from 'react'

interface Props {
  triathlonName: string
  triathlonLocation: string
  triathlonDate: Date
  participants: ParticipantViewModel[]
  races: RaceViewModel[]
  sortMode: SortOrder
  onSortModeChange: (mode: SortOrder) => void
  hasNewResults: boolean
  onClearNewResults: () => void
}

export function ParticipantRaceMatrixTable({
  triathlonName,
  triathlonLocation,
  triathlonDate,
  participants,
  races,
  sortMode,
  onSortModeChange,
  hasNewResults,
  onClearNewResults,
}: Props) {
  const [showOnlyValid, setShowOnlyValid] = useState(false)
  
  const filteredParticipants = showOnlyValid
    ? participants.filter(p => p.hasAllRaceResults(races.map(r => r.type)))
    : participants

  const sortedParticipants =
  sortMode === 'none'
    ? filteredParticipants
    : sortParticipantViewModelsByTotalTime(filteredParticipants, sortMode)

  return (
    <div className="overflow-x-auto mt-6">
      <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Event:</strong> {triathlonName}</p>
        <p><strong>Location:</strong> {triathlonLocation}</p>
        <p><strong>Date:</strong> {triathlonDate.toLocaleDateString('en-GB')}</p>
      </div>

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
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showOnlyValid}
              onChange={() => setShowOnlyValid(prev => !prev)}
              className="accent-green-600"
            />
            Show only complete results
          </label>

          <button
            onClick={() => {
              onSortModeChange(
                sortMode === SortOrder.NONE
                  ? SortOrder.BEST
                  : sortMode === SortOrder.BEST
                  ? SortOrder.WORST
                  : SortOrder.NONE
              )
            }}
            className="text-sm px-3 py-1 border rounded dark:border-gray-600 dark:text-gray-200 flex items-center gap-2"
          >
            <span>
              {sortMode === SortOrder.NONE && '⇅'}
              {sortMode === SortOrder.BEST && '↑'}
              {sortMode === SortOrder.WORST && '↓'}
            </span>
            {sortMode === SortOrder.NONE
              ? 'Unsorted'
              : `Sorted by ${sortMode === SortOrder.BEST ? 'Best Total' : 'Worst Total'}`}
          </button>

          <button
            onClick={() => {
              const csv = generateCSVFromParticipantRaceMatrix(
                participants,
                races,
                triathlonName,
                triathlonLocation,
                triathlonDate
              )
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
