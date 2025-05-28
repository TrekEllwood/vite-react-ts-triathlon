import { useState } from 'react'
import { Race } from '../models/race'
import { RaceType } from '../types/raceType'
import { v4 as uuidv4 } from 'uuid'

export function AddRaceForm({ onAdd }: { onAdd: (race: Race) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<RaceType>(RaceType.SWIM)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const race = new Race(uuidv4(), '1', name, type)
    onAdd(race)
    setName('')
    setType(RaceType.SWIM)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="race-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Race Name:
        </label>
        <input
          id="race-name"
          type="text"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="race-type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Race Type:
        </label>
        <select
          id="race-type"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
          value={type}
          onChange={e => setType(e.target.value as RaceType)}
        >
          {Object.values(RaceType).map(rt => (
            <option key={rt} value={rt}>
              {rt}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Race
      </button>
    </form>
  )
}
