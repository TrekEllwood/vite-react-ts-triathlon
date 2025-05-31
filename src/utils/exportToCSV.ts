import { toast } from 'sonner'
import type { ParticipantViewModel } from '../viewmodels/participantViewModel'
import type { RaceViewModel } from '../viewmodels/raceViewModel'
import { ErrorHandler } from './errorHandler'

export function generateCSVFromParticipantRaceMatrix(
  participants: ParticipantViewModel[],
  races: RaceViewModel[]
): string {
  const headers = ['Name', ...races.map(r => r.name)]
  const rows = participants.map(p => {
    const row = [p.fullName]
    for (const race of races) {
      const time = p.getFormattedTimeForRaceType(race.type)
      row.push(time)
    }
    return row
  })

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

export async function saveCSVToFile(csvContent: string, suggestedName = 'participant-matrix.csv') {
  if (!('showSaveFilePicker' in window)) {
    ErrorHandler.handleErrorMsg('export CSV', 'file-access-api', 'File System Access API is not supported in this browser.')
    return
  }

  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [{
        description: 'CSV file',
        accept: { 'text/csv': ['.csv'] }
      }]
    })

    const writable = await handle.createWritable()
    await writable.write('\uFEFF' + csvContent) // '\uFEFF' ensures UTF-8 characters
    await writable.close()
    toast.success('CSV saved successfully!')
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      toast.info('Export cancelled.')
      return
    }

    ErrorHandler.handleErrorMsg('export CSV', 'participant-matrix', error)
  }
}
