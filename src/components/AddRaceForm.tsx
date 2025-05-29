import { useState } from 'react'
import { RaceType } from '../types/raceType'
import type { RaceViewModel } from '../viewmodels/raceViewModel'

interface AddRaceFormProps {
  onAdd: (name: string, type: RaceType) => void
  existingRaces: RaceViewModel[]
}

export function AddRaceForm({ onAdd, existingRaces }: AddRaceFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<RaceType | ''>('')

  const usedTypes = new Set(existingRaces.map(r => r.type))
  const availableTypes = Object.values(RaceType).filter(rt => !usedTypes.has(rt))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !type) return
    onAdd(name, type as RaceType)
    setName('')
    setType('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Race Type */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Race Type:
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value as RaceType)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Race Type --</option>
            {availableTypes.map(rt => (
              <option key={rt} value={rt}>
                {rt}
              </option>
            ))}
          </select>
        </div>

        {/* Race Name */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Race Name:
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!name || !type}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Add Race
      </button>
    </form>
  )
}
