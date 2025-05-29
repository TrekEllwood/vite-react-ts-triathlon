import { useState } from 'react'
import { useTriathlonViewModel } from '../viewmodels/triathlonViewModel'
import { RaceCard } from '../components/RaceCard'
import { AddRaceForm } from './AddRaceForm'
import { ParticipantManager } from '../components/ParticipantManager'
import { ParticipantResultCard } from './ParticipantResultCard'
import { RaceType } from '../types/raceType'
import { ParticipantRaceMatrixTable } from './ParticipantRaceMatrixTable'

export function TriathlonPage() {
  const [raceVersion, setRaceVersion] = useState(0)
  const [selectedRaceType, setSelectedRaceType] = useState<RaceType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [matrixSortMode, setMatrixSortMode] = useState<'none' | 'best' | 'worst'>('none')
  
  const refreshRaceCards = () => setRaceVersion(v => v + 1)

  const {
    triathlon,
    races,
    participants,
    averageTime,
    deleteRace,
    addOrUpdateParticipant,
    addRaceByDetails,
    addParticipantByDetails,
    clearRaceTime,
    undo,
    redo,
    revert,
    canUndo,
    canRedo,
    commit,
    persist,
  } = useTriathlonViewModel()

  if (!triathlon) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading triathlon...
      </div>
    )
  }

  let participantManager = null
  if (selectedRaceType) {
    const race = races.find(r => r.type === selectedRaceType)
    if (race) {
      participantManager = (
        <ParticipantManager
          raceId={race.id}
          raceType={selectedRaceType}
          participants={participants}
          raceParticipantIds={race.getParticipants().map(p => p.id)}
          
          onParticipantUpdate={(p) => {
            addOrUpdateParticipant(p)
            commit()
            persist()
            refreshRaceCards()
          }}

          onParticipantDelete={(id) => {
            clearRaceTime(id, selectedRaceType)
            refreshRaceCards()
          }}

          onAddToRace={(participant) => {
            race.addParticipantToRace(participant)
            commit()
            persist()
            refreshRaceCards()
          }}

          onAddNewParticipant={(firstName, lastName, bibNumber) => {
            addParticipantByDetails(race.id, firstName, lastName, bibNumber)
            persist()
            commit()
            refreshRaceCards()
          }}  
        />
      )
    }
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-8 bg-white dark:bg-gray-800">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{triathlon.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Location: <span className="font-semibold">{triathlon.location}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Event Date:{" "}
                <span className="font-semibold">{triathlon.date.toLocaleDateString()}</span>
              </p>
            </div>

            {/* Reverts */}
            <div className="flex justify-end gap-1 mt-auto">
              <button
                onClick={() => {
                  undo()
                  refreshRaceCards()
                }}
                disabled={!canUndo}
                className={`px-1 text-xs rounded transition-colors ${
                  canUndo
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-400 text-gray-300 cursor-not-allowed'
                }`}
              >
                Undo
              </button>

              <button
                onClick={() => {
                  redo()
                  refreshRaceCards()
                }}
                disabled={!canRedo}
                className={`px-1 text-xs rounded transition-colors ${
                  canRedo
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-400 text-gray-300 cursor-not-allowed'
                }`}
              >
                Redo
              </button>

              <button
                onClick={() => {
                  revert()
                  refreshRaceCards()
                }}
                className="px-1 text-xs rounded bg-red-900 text-white hover:bg-red-600 transition-colors"
              >
                Revert All
              </button>
            </div>
          </div>
        </div>
       
        {/* Toggleable Race Creation Form */}
        <div className="space-y-4">
          <button
            onClick={() => setShowForm(prev => !prev)}
            className={`px-4 py-1 rounded border transition ${
              showForm
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600'
            }`}
          >
            {showForm ? 'Hide Race Form' : 'Add New Race'}
          </button>

          <div className={`transition-all duration-300 ${showForm ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
            <AddRaceForm onAdd={addRaceByDetails} existingRaces={races} />
          </div>
        </div>

        {/* Race Type Filter */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Participant to Race Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {races.map(race => (
              <button
                key={race.id}
                onClick={() =>
                  setSelectedRaceType(prev =>
                    prev === race.type ? null : race.type
                  )
                }
                className={`px-4 py-1 rounded border transition ${
                  selectedRaceType === race.type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                {race.name} ({race.type})
              </button>
            ))}
          </div>
        </section>

        {/* Participant Management */}
        <section>{participantManager}</section>

        {/* Race Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {races.map(race => (
            <div key={`${race.id}-${raceVersion}`} className="relative">
              <RaceCard
                race={race}
                commit={commit}
                persist={persist}
              />
              <button
                onClick={() => {
                  if (race.hasParticipants()) {
                    alert(`Cannot delete "${race.name}" — it still has participants.`)
                    return
                  }

                  if (window.confirm(`Delete race "${race.name}"?`)) {
                    deleteRace(race.id)
                    commit()
                    setRaceVersion(v => v + 1)
                  }
                }}
                className="absolute top-2 right-2 bg-red-900 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Event Time Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Event Summary
          </h2>

          <div className="text-md text-gray-700 dark:text-gray-300">
            Current Average Event Time:{" "}
            <span className="font-semibold">{averageTime}</span>
          </div>

          <ParticipantRaceMatrixTable
            participants={participants}
            races={races}
            sortMode={matrixSortMode}
            onSortModeChange={setMatrixSortMode}
          />
        </section>

        {/* Participant Summary */}
        <section className="mt-10">
          <ParticipantResultCard participants={participants} />
        </section>
      </div>
    </div>
  )
}
