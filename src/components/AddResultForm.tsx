import { useState } from 'react'
import { RaceType } from '../types/raceType'

export function AddResultForm({
  addResult,
  raceType,
  onAdd,
}: {
  addResult: (raceType: RaceType, hours: string, minutes: string, seconds: string, position: number) => void
  raceType: RaceType
  onAdd: () => void
}) {
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [position, setPosition] = useState(1)

  const isValidTime = () => {
    const h = parseInt(hours || '0', 10)
    const m = parseInt(minutes || '0', 10)
    const s = parseInt(seconds || '0', 10)
    return (
      !isNaN(h) && h >= 0 && h <= 60 &&
      !isNaN(m) && m >= 0 && m <= 60 &&
      !isNaN(s) && s >= 0 && s <= 60
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidTime()) {
      alert('Each time segment must be a number between 0 and 60.')
      return
    }

    addResult(raceType, hours, minutes, seconds, position)
    onAdd()

    setHours('')
    setMinutes('')
    setSeconds('')
    setPosition(1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Time (HH:MM:SS):
      </label>
      <div className="flex gap-2">
        {/* Hours Input */}
        <input
          type="number"
          placeholder="HH"
          value={hours}
          onChange={e => {
            const raw = e.target.value
            const num = parseInt(raw, 10)
            if (raw === '' || (!isNaN(num) && num >= 0 && num <= 60)) {
              setHours(raw)
            }
          }}
          onBlur={() => {
            if (hours !== '') {
              setHours(hours.padStart(2, '0'))
            }
          }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          min="0"
          max="60"
          required
        />

        {/* Minutes Input */}
        <input
          type="number"
          placeholder="MM"
          value={minutes}
          onChange={e => {
            const raw = e.target.value
            const num = parseInt(raw, 10)
            if (raw === '' || (!isNaN(num) && num >= 0 && num <= 60)) {
              setMinutes(raw)
            }
          }}
          onBlur={() => {
            if (minutes !== '') {
              setMinutes(minutes.padStart(2, '0'))
            }
          }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          min="0"
          max="60"
          required
        />

        {/* Seconds Input */}
        <input
          type="number"
          placeholder="SS"
          value={seconds}
          onChange={e => {
            const raw = e.target.value
            const num = parseInt(raw, 10)
            if (raw === '' || (!isNaN(num) && num >= 0 && num <= 60)) {
              setSeconds(raw)
            }
          }}
          onBlur={() => {
            if (seconds !== '') {
              setSeconds(seconds.padStart(2, '0'))
            }
          }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          min="0"
          max="60"
          required
        />
      </div>

      {/* Position Input */}
      <label
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor="position-input"
      >
        Position:
      </label>
      <input
        id="position-input"
        type="number"
        value={position}
        onChange={e => setPosition(parseInt(e.target.value, 10))}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
        required
        min="1"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Result
      </button>
    </form>
  )
}
