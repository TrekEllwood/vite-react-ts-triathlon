import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { RaceType } from '../types/raceType'
import { AddResultForm } from './AddResultForm'
import { createParticipantViewModelFromData } from '../viewmodels/participantViewModel'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'

type AddParticipantResultProps = {
  participants: ParticipantViewModel[]
  raceType: RaceType
  onParticipantUpdate: (updated: ParticipantViewModel) => void
}

export function AddParticipantResult({
  participants,
  raceType,
  onParticipantUpdate,
}: AddParticipantResultProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newFirst, setNewFirst] = useState('')
  const [newLast, setNewLast] = useState('')
  const [bibNumber, setBibNumber] = useState<number | ''>('')

  const selectedParticipant = participants.find(p => p.id === selectedId) ?? null

  const handleCreate = () => {
    if (!newFirst.trim() || !newLast.trim()) {
      alert('First and last name required.')
      return
    }

    const newVM = createParticipantViewModelFromData(
      uuidv4(),
      `race-${raceType.toLowerCase()}`,
      newFirst.trim(),
      newLast.trim(),
      typeof bibNumber === 'number' ? bibNumber : undefined
    )

    onParticipantUpdate(newVM)
    setSelectedId(newVM.id)

    setNewFirst('')
    setNewLast('')
    setBibNumber('')
  }

  const handleResultAdd = () => {
    if (selectedParticipant) {
      onParticipantUpdate(selectedParticipant)
    }
  }

  return (
    <div className="space-y-3 border border-gray-200 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-800">
      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
        Add Result
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Existing:
        </label>
        <select
          value={selectedId ?? ''}
          onChange={e => setSelectedId(e.target.value || null)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
        >
          <option value="">-- Select participant --</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              {p.fullName} ({p.bibNumber ?? 'No bib'})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Or Add New:
        </label>
        <input
          placeholder="First Name"
          value={newFirst}
          onChange={e => setNewFirst(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
        />
        <input
          placeholder="Last Name"
          value={newLast}
          onChange={e => setNewLast(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
        />
        <input
          placeholder="Bib Number (optional)"
          type="number"
          value={bibNumber}
          onChange={e =>
            setBibNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))
          }
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
        >
          Create and Add Result
        </button>
      </div>

      {selectedParticipant && (
        <AddResultForm
          raceType={raceType}
          addResult={selectedParticipant.addResultForRaceType}
          onAdd={handleResultAdd}
        />
      )}
    </div>
  )
}
