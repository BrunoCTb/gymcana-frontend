
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import {
  getExercisesWithHistory,
  type ExerciseHistorySummary,
} from '../../training/data/trainingHistory'
import styles from './ExerciseHistoryPage.module.css'

function ExerciseHistoryPage() {
  const navigate = useNavigate()

  const exercises = useMemo(() => getExercisesWithHistory(), [])

  function openExercise(exercise: ExerciseHistorySummary) {
    navigate(`/progress/exercises/${exercise.exerciseId}`)
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <span className={styles.eyebrow}>ACOMPANHAMENTO</span>
        <h1>Histórico de exercícios</h1>
        <p>Acompanhe sua evolução em cada exercício, independentemente da rotina.</p>
      </header>

      <section className={styles.section}>
        <SectionHeader title="Seus exercícios" />

        <Card className={styles.list}>
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <button
                type="button"
                className={styles.exercise}
                key={exercise.exerciseId}
                onClick={() => openExercise(exercise)}
              >
                <div className={styles.exerciseInfo}>
                  <strong>{exercise.name}</strong>
                  <span>
                    {exercise.muscle} · {exercise.workoutCount} treinos
                  </span>
                </div>

                <ChevronRight size={19} />
              </button>
            ))
          ) : (
            <div className={styles.empty}>
              <strong>Nenhum exercício registrado ainda.</strong>
              <p>
                Finalize alguns treinos para começar a acompanhar a evolução
                individual dos exercícios.
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default ExerciseHistoryPage
