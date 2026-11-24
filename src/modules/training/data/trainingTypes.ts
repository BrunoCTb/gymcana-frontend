export type SetStatus = 'pending' | 'completed' | 'skipped'

export type WorkoutSetType =
  | 'warmup'
  | 'preparation'
  | 'working'
  | 'custom'

export type WorkoutSet = {
  id: number
  type: WorkoutSetType
  typeLabel?: string
  reps: number
  weight: number
  notes: string
  status: SetStatus
}
