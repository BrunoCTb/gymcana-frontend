
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Card from '../../../components/ui/Card'
import {
  getExercisesWithHistory,
  getExerciseHistory,
} from '../../training/data/trainingHistory'
import styles from './ExerciseHistoryDetailPage.module.css'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function ExerciseHistoryDetailPage() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()

  const exercise = getExercisesWithHistory().find(
    item => item.exerciseId === exerciseId,
  )

  const history = exerciseId
    ? [...getExerciseHistory(exerciseId)].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime(),
      )
    : []

  if (!exercise) {
    return (
      <div className={styles.page}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/progress/exercises')}
        >
          <ArrowLeft size={18} />
          Exercícios
        </button>
        <Card>
          <strong>Exercício não encontrado.</strong>
          <p>Não encontramos registros para este exercício.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/progress/exercises')}
        >
          <ArrowLeft size={18} />
          Exercícios
        </button>

        <span className={styles.eyebrow}>HISTÓRICO DE EXERCÍCIO</span>
        <h1>{exercise.name}</h1>
        <p>{exercise.muscle}</p>
      </header>

      <div className={styles.summary}>
        <Card>
          <span>Treinos realizados</span>
          <strong>{exercise.workoutCount}</strong>
        </Card>
        <Card>
          <span>Última execução</span>
          <strong>{formatDate(exercise.lastPerformedAt)}</strong>
        </Card>
      </div>

      <section className={styles.section}>
        <h2>Histórico de desempenho</h2>

        {history.length > 0 ? (
          history.map(record => {
            const completedSets = record.sets.filter(
              set => set.status === 'completed',
            )

            return (
              <Card className={styles.record} key={record.workoutId}>
                <div className={styles.recordHeader}>
                  <div>
                    <strong>{record.routineName}</strong>
                    <span>{formatDate(record.completedAt)}</span>
                  </div>
                  <span>{completedSets.length} séries concluídas</span>
                </div>

                <div className={styles.setList}>
                  {record.sets.map((set, index) => (
                    <div className={styles.set} key={set.id}>
                      <span>Série {index + 1}</span>

                      {set.status === 'completed' ? (
                        <strong>
                          {set.weight} kg × {set.reps} reps
                        </strong>
                      ) : (
                        <span className={styles.uncompleted}>
                          {set.status === 'skipped'
                            ? 'Série pulada'
                            : 'Não realizada'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )
          })
        ) : (
          <Card>
            <p>Nenhum registro encontrado.</p>
          </Card>
        )}
      </section>
    </div>
  )
}

export default ExerciseHistoryDetailPage
