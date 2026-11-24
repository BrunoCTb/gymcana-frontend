
export type RoutineExercise = {
  id: string
  name: string
  muscle: string
  targetReps: string
  sets: number
  referenceWeight: number
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
        name: 'Supino inclinado com halteres',
        muscle: 'Peito superior',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 22,
      },
      {
        id: 'wide-lat-pulldown',
        name: 'Puxada alta aberta',
        muscle: 'Costas',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 45,
      },
      {
        id: 'machine-shoulder-press',
        name: 'Desenvolvimento máquina',
        muscle: 'Ombros',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 30,
      },
      {
        id: 'preacher-curl',
        name: 'Rosca Scott',
        muscle: 'Bíceps',
        targetReps: '8–12',
        sets: 3,
        referenceWeight: 20,
      },
      {
        id: 'triceps-rope',
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

export function getRoutines(): Routine[] {
  try {
    const saved = localStorage.getItem(ROUTINES_KEY)

    if (saved) {
      return JSON.parse(saved) as Routine[]
    }
  } catch {
    localStorage.removeItem(ROUTINES_KEY)
  }

  localStorage.setItem(ROUTINES_KEY, JSON.stringify(defaultRoutines))
  return defaultRoutines
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
