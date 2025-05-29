import { useState } from 'react'

interface AddParticipantFormProps {
  raceId: string
  onAdd: (data: {
    id: string
    raceId: string
    firstName: string
    lastName: string
    bibNumber?: number
  }) => void
}

export function AddParticipantForm({ raceId, onAdd }: AddParticipantFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bib, setBib] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required.')
      return
    }

    try {
      onAdd({
        id: crypto.randomUUID(),
        raceId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bibNumber: bib ? Number(bib) : undefined
      })

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
        <label className="block text-sm font-medium">First Name:</label>
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Last Name:</label>
        <input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bib Number (optional):</label>
        <input
          type="number"
          value={bib}
          onChange={e => setBib(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
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
