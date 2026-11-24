
export type LibraryExercise = {
  id: string
  name: string
  muscle: string
}

const LIBRARY_KEY = 'gymcana-exercise-library'

const defaultExercises: LibraryExercise[] = [
  { id: 'incline-dumbbell-press', name: 'Supino inclinado com halteres', muscle: 'Peito superior' },
  { id: 'wide-lat-pulldown', name: 'Puxada alta aberta', muscle: 'Costas' },
  { id: 'machine-shoulder-press', name: 'Desenvolvimento máquina', muscle: 'Ombros' },
  { id: 'preacher-curl', name: 'Rosca Scott', muscle: 'Bíceps' },
  { id: 'triceps-rope', name: 'Tríceps corda', muscle: 'Tríceps' },
  { id: 'hack-squat', name: 'Agachamento hack', muscle: 'Quadríceps' },
  { id: 'leg-extension', name: 'Cadeira extensora', muscle: 'Quadríceps' },
  { id: 'leg-curl', name: 'Mesa flexora', muscle: 'Posterior de coxa' },
  { id: 'hip-thrust', name: 'Hip thrust', muscle: 'Glúteos' },
  { id: 'seated-calf-raise', name: 'Panturrilha sentada', muscle: 'Panturrilhas' },
  { id: 'abdominal', name: 'Abdominal', muscle: 'Abdômen' },
]

export function getExerciseLibrary(): LibraryExercise[] {
  try {
    const saved = localStorage.getItem(LIBRARY_KEY)

    if (saved) {
      return JSON.parse(saved) as LibraryExercise[]
    }
  } catch {
    localStorage.removeItem(LIBRARY_KEY)
  }

  localStorage.setItem(LIBRARY_KEY, JSON.stringify(defaultExercises))
  return defaultExercises
}

export function saveExerciseLibrary(exercises: LibraryExercise[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(exercises))
}

export function addCustomExercise(exercise: LibraryExercise) {
  const exercises = getExerciseLibrary()

  const alreadyExists = exercises.some(
    (item) => item.name.toLowerCase() === exercise.name.toLowerCase(),
  )

  if (alreadyExists) {
    throw new Error('Já existe um exercício com esse nome.')
  }

  saveExerciseLibrary([...exercises, exercise])
}
