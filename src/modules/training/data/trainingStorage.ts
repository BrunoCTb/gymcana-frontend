import type { WorkoutSetType } from './trainingTypes'
import {
  getExerciseLibrary,
  saveExerciseLibrary,
  type LibraryExercise,
} from './exerciseLibrary'

export type RoutineExercise = {
  id: string
  exerciseId: string
  name: string
  muscle: string
  targetReps?: string
  sets: number
  setTypes?: WorkoutSetType[]
  setTypeLabels?: string[]
  referenceWeight?: number
}

export type Routine = {
  id: string
  name: string
  description: string
  category: string
  exercises: RoutineExercise[]
}

const ROUTINES_KEY = 'gymcana-routines'
const SELECTED_ROUTINE_KEY = 'gymcana-selected-routine'

const defaultRoutines: Routine[] = [
  {
    id: 'upper-a',
    name: 'Upper A',
    description: 'Peito, costas, ombros e braços',
    category: 'Treino superior',
    exercises: [
      {
        id: 'incline-dumbbell-press',
        exerciseId: 'incline-dumbbell-press',
        name: 'Supino inclinado com halteres',
        muscle: 'Peito superior',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 22,
      },
      {
        id: 'wide-lat-pulldown',
        exerciseId: 'wide-lat-pulldown',
        name: 'Puxada alta aberta',
        muscle: 'Costas',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 45,
      },
      {
        id: 'machine-shoulder-press',
        exerciseId: 'machine-shoulder-press',
        name: 'Desenvolvimento máquina',
        muscle: 'Ombros',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 30,
      },
      {
        id: 'preacher-curl',
        exerciseId: 'preacher-curl',
        name: 'Rosca Scott',
        muscle: 'Bíceps',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 20,
      },
      {
        id: 'triceps-rope',
        exerciseId: 'triceps-rope',
        name: 'Tríceps corda',
        muscle: 'Tríceps',
        targetReps: '10–12',
        sets: 3,
        referenceWeight: 25,
      },
    ],
  },
  {
    id: 'lower',
    name: 'Lower',
    description: 'Pernas, glúteos e panturrilhas',
    category: 'Treino inferior',
    exercises: [],
  },
]

function normalizeRoutines(routines: Routine[]): Routine[] {
  const library = getExerciseLibrary()
  let libraryChanged = false
  let routinesChanged = false

  const normalized = routines.map((routine) => ({
    ...routine,
    exercises: routine.exercises.map((exercise) => {
      let exerciseId = exercise.exerciseId

      if (!exerciseId || !library.some((item) => item.id === exerciseId)) {
        const existing = library.find(
          (item: LibraryExercise) =>
            item.name.trim().toLowerCase() === exercise.name.trim().toLowerCase() &&
            item.muscle.trim().toLowerCase() === exercise.muscle.trim().toLowerCase(),
        )

        if (existing) {
          exerciseId = existing.id
        } else {
          const newLibraryExercise: LibraryExercise = {
            id: crypto.randomUUID(),
            name: exercise.name,
            muscle: exercise.muscle,
          }

          library.push(newLibraryExercise)
          exerciseId = newLibraryExercise.id
          libraryChanged = true
        }
      }

      const setTypes = Array.from(
      { length: exercise.sets },
      (_, index) => exercise.setTypes?.[index] ?? 'working',
      )

      if (
        exercise.exerciseId !== exerciseId ||
        !exercise.setTypes ||
        exercise.setTypes.length !== exercise.sets ||
        exercise.setTypes.some((type, index) => type !== setTypes[index])
      ) {
        routinesChanged = true
      }

      return {
        ...exercise,
        exerciseId,
        setTypes,
      }
    }),
  }))

  if (libraryChanged) {
    saveExerciseLibrary(library)
  }

  if (routinesChanged) {
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(normalized))
  }

  return normalized
}

export function getRoutines(): Routine[] {
  try {
    const saved = localStorage.getItem(ROUTINES_KEY)

    if (saved) {
      return normalizeRoutines(JSON.parse(saved) as Routine[])
    }
  } catch {
    localStorage.removeItem(ROUTINES_KEY)
  }

  localStorage.setItem(ROUTINES_KEY, JSON.stringify(defaultRoutines))
  return normalizeRoutines(defaultRoutines)
}

export function saveRoutines(routines: Routine[]) {
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines))
}

export function getRoutineById(id: string): Routine | undefined {
  return getRoutines().find((routine) => routine.id === id)
}

export function getSelectedRoutineId(): string {
  return (
    localStorage.getItem(SELECTED_ROUTINE_KEY) ??
    defaultRoutines[0].id
  )
}

export function setSelectedRoutineId(id: string) {
  localStorage.setItem(SELECTED_ROUTINE_KEY, id)
}
