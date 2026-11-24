
export type WorkoutSetStatus = 'pending' | 'completed' | 'skipped'

export type WorkoutHistoryEntry = {
  id: string
  routineId: string
  routineName: string
  completedAt: string
  durationSeconds: number
  totalSets: number
  completedSets: number
  skippedSets: number
  exercises: {
    id: number
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

    return Array.isArray(parsed) ? parsed : []
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
