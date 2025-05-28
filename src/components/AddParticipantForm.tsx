import { useState } from 'react'
import { Participant } from '../models/participant'
import { v4 as uuidv4 } from 'uuid'

export function AddParticipantForm({
  raceId,
  onAdd,
}: {
  raceId: string
  onAdd: (participant: Participant) => void
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bib, setBib] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const participant = new Participant(
        uuidv4(),
        raceId,
        firstName,
        lastName,
        bib ? Number(bib) : undefined
      )
      onAdd(participant)
      setFirstName('')
      setLastName('')
      setBib('')
      setError('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>}

      <div>
        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          First Name:
        </label>
        <input
          id="first-name"
          type="text"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Last Name:
        </label>
        <input
          id="last-name"
          type="text"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="bib" className="block text-sm font-medium text-gray-700">
          Bib Number (optional):
        </label>
        <input
          id="bib"
          type="number"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          value={bib}
          onChange={e => setBib(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add Participant
      </button>
    </form>
  )
}
