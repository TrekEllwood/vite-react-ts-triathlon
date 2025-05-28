import type { RaceType } from '../types/raceType'

export function ResultDisplay({
  formattedTime,
  raceType,
}: {
  formattedTime: string
  raceType: RaceType
}) {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-300">
      <ul className="list-disc list-inside">
        <li>
          {raceType}: {formattedTime}
        </li>
      </ul>
    </div>
  )
}

