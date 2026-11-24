
import { useState } from 'react'
import { Link } from 'react-router'
import { Plus, Play, Pencil } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import {
  getRoutines,
  getSelectedRoutineId,
  setSelectedRoutineId,
} from '../data/trainingStorage'
import styles from './TrainingPage.module.css'

function TrainingPage() {
  const [routines] = useState(getRoutines)
  const [selectedId, setSelectedId] = useState(getSelectedRoutineId)

  const selectedRoutine =
    routines.find((routine) => routine.id === selectedId) ?? routines[0]

  function selectRoutine(id: string) {
    setSelectedId(id)
    setSelectedRoutineId(id)
  }

  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>SEU TREINAMENTO</span>
          <h1>Treino</h1>
          <p>Gerencie suas rotinas e acompanhe sua evolução.</p>
        </div>

        <div className={styles.headingActions}>
          <Link
            to="/training/routines/new"
            className={`${styles.actionButton} ${styles.secondaryAction}`}
          >
            <Plus size={17} />
            Criar rotina
          </Link>

          {selectedRoutine.exercises.length > 0 ? (
            <Link
              to="/training/session"
              onClick={() => setSelectedRoutineId(selectedRoutine.id)}
              className={`${styles.actionButton} ${styles.primaryAction}`}
            >
              <Play size={17} />
              Iniciar treino
            </Link>
          ) : (
            <span className={styles.disabledAction}>
              Adicione exercícios para iniciar
            </span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Minhas rotinas" />

        <div className={styles.routineList}>
          {routines.map((routine, index) => {
            const isSelected = routine.id === selectedId

            return (
              <Card
                key={routine.id}
                style={{
                  borderColor: isSelected
                    ? 'var(--color-primary)'
                    : undefined,
                }}
              >
                <button
                  type="button"
                  onClick={() => selectRoutine(routine.id)}
                  style={{
                    width: '100%',
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    color: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <div className={styles.routineHeader}>
                    <div>
                      <span className={isSelected ? styles.activeLabel : styles.cardLabel}>
                        {isSelected ? 'ROTINA SELECIONADA' : 'ROTINA'}
                      </span>
                      <h2>{routine.name}</h2>
                      <p>{routine.description}</p>
                    </div>

                    <span className={styles.routineBadge}>
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  <div className={styles.routineFooter}>
                    <span>{routine.exercises.length} exercícios</span>
                    <span>•</span>
                    <span>{routine.category}</span>
                  </div>
                </button>
              </Card>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title={selectedRoutine.name} />

        <Link
          to={`/training/routines/${selectedRoutine.id}`}
          className={`${styles.actionButton} ${styles.editAction}`}
        >
          <Pencil size={15} />
          Editar rotina
        </Link>

        {selectedRoutine.exercises.length > 0 ? (
          <div className={styles.exerciseList}>
            {selectedRoutine.exercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className={styles.exercise}>
                  <div className={styles.exerciseNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className={styles.exerciseInfo}>
                    <h3>{exercise.name}</h3>
                    <span>{exercise.muscle}</span>

                    <div className={styles.exerciseDetails}>
                      <span>{exercise.sets} séries</span>
                      <span>{exercise.targetReps} reps</span>
                    </div>
                  </div>

                  <div className={styles.load}>
                    <strong>{exercise.referenceWeight} kg</strong>
                    <span>Última carga</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p>Esta rotina ainda não possui exercícios cadastrados.</p>
          </Card>
        )}
      </section>
    </div>
  )
}

export default TrainingPage
