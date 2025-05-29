import { RaceType } from '../types/raceType'

export function ParticipantSummary({
  fullName,
  formattedTime,
  raceType,
  onSelect,
  isSelected,
}: {
  fullName: string
  formattedTime: string
  raceType: RaceType
  onSelect?: () => void
  isSelected?: boolean
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer border p-2 rounded space-y-1 transition-colors
        ${isSelected
          ? 'bg-blue-100 dark:bg-blue-800 border-blue-400'
          : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'}
      `}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        {raceType}: {formattedTime}
      </p>
    </div>
  )
}
