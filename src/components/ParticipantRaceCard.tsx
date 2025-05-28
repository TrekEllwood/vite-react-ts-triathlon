import { useReducer } from 'react'
import { ResultDisplay } from './ResultDisplay'
import { AddResultForm } from './AddResultForm'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'
import { RaceType } from '../types/raceType'

type ParticipantRaceCardProps = {
  participant: ParticipantViewModel
  raceType: RaceType
  onResultAdded?: () => void
}

export function ParticipantRaceCard({
  participant,
  raceType,
  onResultAdded,
}: ParticipantRaceCardProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleAddResult = () => {
    forceUpdate()
    onResultAdded?.()
  }

  const hasResult = participant.hasResultForRaceType(raceType)
  const formattedTime = participant.getFormattedTimeForRaceType(raceType)

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3 space-y-2">
      <h3 className="text-md font-semibold text-gray-700 dark:text-white">{participant.fullName}</h3>
      {/* <p className="text-sm text-gray-500 dark:text-gray-300">Total Time: {participant.getTotalTime()}</p> */}

      <AddResultForm
        raceType={raceType}
        addResult={participant.addResultForRaceType}
        onAdd={handleAddResult}
      />

      {hasResult ? (
        <ResultDisplay raceType={raceType} formattedTime={formattedTime} />
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">No result for {raceType}</p>
      )}
    </div>
  )
}
