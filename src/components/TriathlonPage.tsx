import { useState } from 'react'
import { useTriathlonViewModel } from '../viewmodels/triathlonViewModel'
import { RaceCard } from '../components/RaceCard'
import { AddRaceForm } from './AddRaceForm'
import { ParticipantManager } from '../components/ParticipantManager'
import { ParticipantResultCard } from './ParticipantResultCard'
import { RaceType } from '../types/raceType'

export function TriathlonPage() {
  const {
    triathlon,
    races,
    participants,
    averageTime,
    addRace,
    deleteRace,
    addOrUpdateParticipant,
    persist,
  } = useTriathlonViewModel()

  const [selectedRaceType, setSelectedRaceType] = useState<RaceType | null>(null)
  const [showForm, setShowForm] = useState(false)
  // const selectedRace = races.find(r => r.type === selectedRaceType) ?? null
  const [raceVersion, setRaceVersion] = useState(0)
  const refreshRaceCards = () => setRaceVersion(v => v + 1)

  if (!triathlon) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading triathlon...
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Triathlon Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{triathlon.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{triathlon.location}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Event Time: {averageTime}</p>
        </header>

        {/* Race Creation Form */}
        {/* <AddRaceForm onAdd={addRace} /> */}
        
        {/* Toggleable Race Creation Form */}
        <div className="space-y-4">
          <button
            onClick={() => setShowForm(prev => !prev)}
            className={`px-4 py-1 rounded border transition ${
              showForm
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600'
            }`}
          >
            {showForm ? 'Hide Race Form' : 'Add New Race'}
          </button>

          {showForm && <AddRaceForm onAdd={addRace} />}
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
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                {race.name} ({race.type})
              </button>
            ))}
          </div>
        </section>

        {/* Participant Management */}
        {selectedRaceType && (
          <section>
            {/* <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Manage Participants for: {selectedRaceType}
            </h2> */}

            {(() => {
              const race = races.find(r => r.type === selectedRaceType)
              if (!race) return null

              return (
                <ParticipantManager
                  raceType={selectedRaceType}
                  participants={participants}
                  raceParticipantIds={race.getParticipants().map(p => p.id)}
                  onParticipantUpdate={(p) => {
                    addOrUpdateParticipant(p)
                    persist()
                    refreshRaceCards()
                  }}
                  onParticipantDelete={(id) => {
                    race.getModel().deleteParticipant(id)
                    persist()
                    refreshRaceCards()
                  }}
                  onAddToRace={(participant) => {
                    race.getModel().addParticipant(participant.getModel())
                    persist()
                    refreshRaceCards()
                  }}
                />
              )
            })()}
          </section>
        )}

        {/* Race Cards */}
        {/* <div className="grid gap-6 md:grid-cols-2">
          {races.map(race => (
            <RaceCard key={`${race.id}-${raceVersion}`} race={race} />
          ))}
        </div> */}

        <div className="grid gap-6 md:grid-cols-2">
          {races.map(race => (
            <div key={`${race.id}-${raceVersion}`} className="relative">
              <RaceCard race={race} />
              <button
                onClick={() => {
                  if (window.confirm(`Delete race "${race.name}"?`)) {
                    deleteRace(race.id)
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

        {/* Participant Summary */}
        <section className="mt-10">
          <ParticipantResultCard participants={participants} />
        </section>

      </div>
    </div>
  )
}
