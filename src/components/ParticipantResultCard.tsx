import { useState, useEffect } from 'react'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'

type Props = {
  participants: ParticipantViewModel[]
}

export function ParticipantResultCard({ participants }: Props) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [_, forceRender] = useState(0)

  useEffect(() => {
    forceRender(n => n + 1)
  }, [participants])

  const filtered = participants.filter(vm =>
    vm.fullName.toLowerCase().includes(search.toLowerCase())
  )

  const selected = participants.find(vm => vm.id === selectedId)

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Participant Total Event Time</h2>

      {/* Search + Dropdown */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input with live results */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search by name
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 rounded"
          />

          {search && (
            <div className="border border-gray-200 dark:border-gray-600 rounded shadow-sm max-h-60 overflow-y-auto bg-white dark:bg-gray-700 mt-2">
              {filtered.length === 0 ? (
                <p className="p-2 text-sm text-gray-500 dark:text-gray-400 italic">No matches found</p>
              ) : (
                filtered.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedId(p.id)
                      setSearch('')
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
                  >
                    {p.fullName} {p.bibNumber ? `(Bib: ${p.bibNumber})` : ''}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Dropdown selector */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select participant
          </label>
          <select
            value={selectedId ?? ''}
            onChange={e => setSelectedId(e.target.value || null)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
          >
            <option value="">-- Select Participant --</option>
            {participants.map(vm => (
              <option key={vm.id} value={vm.id}>
                {vm.fullName} {vm.bibNumber ? `(Bib: ${vm.bibNumber})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected participant total time */}
      {selected && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-3 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Total Time for <span className="font-bold">{selected.fullName}</span>:
          </p>
          <p className="text-lg font-mono text-blue-900 dark:text-blue-200">{selected.getTotalTime()}</p>
        </div>
      )}
    </div>
  )
}
