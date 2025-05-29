import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { RaceType } from '../types/raceType'
import { createParticipantViewModelFromData } from '../viewmodels/participantViewModel'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'

type ParticipantManagerProps = {
  raceId: string
  raceType: RaceType
  participants: ParticipantViewModel[]
  raceParticipantIds: string[]
  onParticipantUpdate: (updated: ParticipantViewModel) => void
  onParticipantDelete?: (id: string) => void
  onAddToRace?: (participant: ParticipantViewModel) => void
  onAddNewParticipant: (first: string, last: string, bib?: number) => void
}

export function ParticipantManager({
  raceId,
  participants,
  raceParticipantIds,
  onParticipantUpdate,
  onParticipantDelete,
  onAddToRace,
}: ParticipantManagerProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bibNumber, setBibNumber] = useState<number | ''>('')
  const [selectedId, setSelectedId] = useState<string>('')

  const handleCreateParticipant = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('First and last name are required.')
      return
    }

    const participantVM = createParticipantViewModelFromData(
      uuidv4(),
      raceId,
      firstName.trim(),
      lastName.trim(),
      typeof bibNumber === 'number' ? bibNumber : undefined
    )

    onParticipantUpdate(participantVM)

    setFirstName('')
    setLastName('')
    setBibNumber('')
  }

  const selectedParticipant = participants.find(p => p.id === selectedId)
  const isInRace = selectedParticipant ? raceParticipantIds.includes(selectedParticipant.id) : false

  return (
    <div className="space-y-6">
      {/* Create new participant */}
      <div className="space-y-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          Create New Participant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded"
          />
          <input
            type="number"
            placeholder="Bib Number (optional)"
            value={bibNumber}
            onChange={e =>
              setBibNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateParticipant}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      {/* Manage existing participants */}
      <div className="space-y-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Manage Existing Participants</h2>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
        >
          <option value="">-- Select Participant --</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              {p.fullName} {p.bibNumber ? `(Bib: ${p.bibNumber})` : ''}
            </option>
          ))}
        </select>

        {selectedParticipant && (
          <div className="flex flex-wrap gap-4 mt-2 items-center">
            <button
              onClick={() => onAddToRace?.(selectedParticipant)}
              disabled={isInRace}
              title={isInRace ? 'Already in race' : 'Add participant to this race'}
              className={`text-sm px-3 py-1 rounded transition ${
                isInRace
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Add to Race
            </button>
            <button
              onClick={() => onParticipantDelete?.(selectedParticipant.id)}
              disabled={!isInRace}
              title={!isInRace ? 'Not in this race' : 'Remove participant from this race'}
              className={`text-sm px-3 py-1 rounded transition ${
                !isInRace
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-red-900 text-white hover:bg-red-600'
              }`}
            >
              Remove from Race
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
