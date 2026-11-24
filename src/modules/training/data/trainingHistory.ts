
import { getRoutines } from './trainingStorage'
import { getExerciseLibrary } from './exerciseLibrary'
import type { WorkoutSet } from './trainingTypes'

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
    exerciseId?: string
    name: string
    muscle: string
    targetReps?: string
    sets: WorkoutSet[]
  }[]
}

const HISTORY_KEY = 'gymcana-workout-history'

function normalizeSet(set: Partial<WorkoutSet>, index: number): WorkoutSet {
  return {
    id: set.id ?? index + 1,
    type: set.type ?? 'working',
    typeLabel: set.typeLabel,
    reps: set.reps ?? 0,
    weight: set.weight ?? 0,
    notes: set.notes ?? '',
    status: set.status ?? 'pending',
  }
}

export function getWorkoutHistory(): WorkoutHistoryEntry[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)

    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    const routines = getRoutines()
    const library = getExerciseLibrary()

    let changed = false

    const normalized = parsed.map((workout) => {
      const routine = routines.find(
        (item) => item.id === workout.routineId,
      )

      return {
        ...workout,
        exercises: (workout.exercises ?? []).map((exercise: WorkoutHistoryEntry['exercises'][number]) => {
          let exerciseId = exercise.exerciseId

          if (!exerciseId) {
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

            exerciseId =
              routineExercise?.exerciseId ?? libraryExercise?.id

            if (exerciseId) changed = true
          }

          const sets = (exercise.sets ?? []).map(
            (set: Partial<WorkoutSet>, index: number) => {
              const normalizedSet = normalizeSet(set, index)

              if (
                set.type === undefined ||
                set.notes === undefined ||
                set.reps === undefined ||
                set.weight === undefined
              ) {
                changed = true
              }

              return normalizedSet
            },
          )

          return {
            ...exercise,
            exerciseId,
            sets,
          }
        }),
      }
    }) as WorkoutHistoryEntry[]

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

export type ExerciseHistorySummary = {
  exerciseId: string
  name: string
  muscle: string
  workoutCount: number
  lastPerformedAt: string
}

export type ExerciseHistoryRecord = {
  workoutId: string
  routineName: string
  completedAt: string
  sets: WorkoutSet[]
}

export function getExercisesWithHistory(): ExerciseHistorySummary[] {
  const history = getWorkoutHistory()
  const exercises = new Map<string, ExerciseHistorySummary>()

  history.forEach((workout) => {
    const seenInWorkout = new Set<string>()

    workout.exercises.forEach((exercise) => {
      if (!exercise.exerciseId || seenInWorkout.has(exercise.exerciseId)) {
        return
      }

      seenInWorkout.add(exercise.exerciseId)

      const existing = exercises.get(exercise.exerciseId)

      if (existing) {
        existing.workoutCount += 1

        if (
          new Date(workout.completedAt) >
          new Date(existing.lastPerformedAt)
        ) {
          existing.lastPerformedAt = workout.completedAt
        }

        return
      }

      exercises.set(exercise.exerciseId, {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        muscle: exercise.muscle,
        workoutCount: 1,
        lastPerformedAt: workout.completedAt,
      })
    })
  })

  return Array.from(exercises.values()).sort(
    (a, b) =>
      new Date(b.lastPerformedAt).getTime() -
      new Date(a.lastPerformedAt).getTime(),
  )
}

export function getExerciseHistory(
  exerciseId: string,
): ExerciseHistoryRecord[] {
  return getWorkoutHistory()
    .filter((workout) =>
      workout.exercises.some(
        (exercise) => exercise.exerciseId === exerciseId,
      ),
    )
    .map((workout) => {
      const exercise = workout.exercises.find(
        (item) => item.exerciseId === exerciseId,
      )!

      return {
        workoutId: workout.id,
        routineName: workout.routineName,
        completedAt: workout.completedAt,
        sets: exercise.sets,
      }
    })
}
