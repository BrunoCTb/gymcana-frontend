
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import Card from '../../../components/ui/Card'
import {
  getWorkoutHistory,
  type WorkoutHistoryEntry,
} from '../../training/data/trainingHistory'
import styles from './WorkoutHistoryPage.module.css'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function WorkoutHistoryPage() {
  const navigate = useNavigate()
  const [history] = useState<WorkoutHistoryEntry[]>(getWorkoutHistory)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/progress')}
        >
          <ArrowLeft size={18} />
          Evolução
        </button>

        <span className={styles.eyebrow}>ACOMPANHAMENTO</span>
        <h1>Histórico de treinos</h1>
        <p>Consulte suas sessões e os detalhes de cada treino.</p>
      </header>

      <Card className={styles.list}>
        {history.length > 0 ? (
          history.map((workout) => {
            const isExpanded = expanded === workout.id

            return (
              <div className={styles.item} key={workout.id}>
                <button
                  type="button"
                  className={styles.itemButton}
                  onClick={() =>
                    setExpanded(isExpanded ? null : workout.id)
                  }
                  aria-expanded={isExpanded}
                >
                  <div className={styles.info}>
                    <strong>{workout.routineName}</strong>
                    <span>{formatDate(workout.completedAt)}</span>
                    <span>
                      {workout.completedSets} séries concluídas
                      {' · '}
                      {Math.floor(workout.durationSeconds / 60)} min
                    </span>
                  </div>

                  <div className={styles.action}>
                    <span>{workout.exercises.length} exercícios</span>
                    <ChevronDown
                      size={18}
                      className={isExpanded ? styles.expanded : ''}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className={styles.details}>
                    {workout.exercises.map((exercise) => (
                      <div className={styles.exercise} key={exercise.id}>
                        <div className={styles.exerciseHeader}>
                          <strong>{exercise.name}</strong>
                          <span>{exercise.muscle}</span>
                        </div>

                        <div className={styles.setList}>
                          {exercise.sets.map((set, index) => (
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className={styles.empty}>
            <strong>Nenhum treino registrado ainda.</strong>
            <p>
              Seus treinos concluídos aparecerão aqui.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default WorkoutHistoryPage
