import { getRoutines } from './trainingStorage'
import { getExerciseLibrary } from './exerciseLibrary'

export type WorkoutSetStatus = 'pending' | 'completed' | 'skipped'

export type WorkoutHistoryEntry = {
  id: string
  exerciseId?: string
  routineId: string
  routineName: string
  completedAt: string
  durationSeconds: number
  totalSets: number
  completedSets: number
  skippedSets: number
  exercises: {
    id: number
    exerciseId?: string
    name: string
    muscle: string
    targetReps: string
    sets: {
      id: number
      reps: number
      weight: number
      status: WorkoutSetStatus
    }[]
  }[]
}

const HISTORY_KEY = 'gymcana-workout-history'

export function getWorkoutHistory(): WorkoutHistoryEntry[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)

    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    const routines = getRoutines()
    const library = getExerciseLibrary()

    let changed = false

    const normalized = (parsed as WorkoutHistoryEntry[]).map((workout) => {
      const routine = routines.find(
        (item) => item.id === workout.routineId,
      )

      return {
        ...workout,
        exercises: workout.exercises.map((exercise) => {
          if (exercise.exerciseId) return exercise

          const routineExercise = routine?.exercises.find(
            (item) =>
              item.name === exercise.name &&
              item.muscle === exercise.muscle,
          )

          const libraryExercise = library.find(
            (item) =>
              item.name.trim().toLowerCase() === exercise.name.trim().toLowerCase() &&
              item.muscle.trim().toLowerCase() === exercise.muscle.trim().toLowerCase(),
          )

          const exerciseId =
            routineExercise?.exerciseId ?? libraryExercise?.id

          if (!exerciseId) return exercise

          changed = true

          return {
            ...exercise,
            exerciseId,
          }
        }),
      }
    })

    if (changed) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(normalized))
    }

    return normalized
  } catch {
    return []
  }
}

type CompletedWorkoutInput = Pick<
  WorkoutHistoryEntry,
  'routineId' | 'routineName' | 'exercises'
> & {
  elapsedSeconds: number
}

export function saveCompletedWorkout(session: CompletedWorkoutInput) {
  const totalSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  )

  const completedSets = session.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.status === 'completed').length,
    0,
  )

  const skippedSets = session.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.status === 'skipped').length,
    0,
  )

  const entry: WorkoutHistoryEntry = {
    id: crypto.randomUUID(),
    routineId: session.routineId,
    routineName: session.routineName,
    completedAt: new Date().toISOString(),
    durationSeconds: session.elapsedSeconds,
    totalSets,
    completedSets,
    skippedSets,
    exercises: session.exercises,
    }

  const history = getWorkoutHistory()

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([entry, ...history]),
  )

  return entry
}
