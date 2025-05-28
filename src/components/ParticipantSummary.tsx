import { RaceType } from '../types/raceType'

export function ParticipantSummary({
  fullName,
  formattedTime,
  raceType,
  onSelect,
}: {
  fullName: string
  formattedTime: string
  raceType: RaceType
  onSelect?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 p-2 rounded space-y-1"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</p>
      <p className="ext-xs text-gray-600 dark:text-gray-300">
        {raceType}: {formattedTime}
      </p>
    </div>
  )
}
