
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Dumbbell,
  Minus,
  Plus,
  X
} from 'lucide-react'
import {
  getRoutines,
  getRoutineById,
  getSelectedRoutineId,
} from '../data/trainingStorage'
import Card from '../../../components/ui/Card'
import styles from './WorkoutSessionPage.module.css'
import { saveCompletedWorkout } from '../data/trainingHistory'

type SetStatus = 'pending' | 'completed' | 'skipped'

type WorkoutSet = {
  id: number
  reps: number
  weight: number
  status: SetStatus
}

type Exercise = {
  id: number
  name: string
  muscle: string
  targetReps: string
  sets: WorkoutSet[]
}

type SessionState = {
  routineId: string
  routineName: string
  exercises: Exercise[]
  currentExerciseIndex: number
  elapsedSeconds: number
  restSeconds: number
}

const STORAGE_KEY = 'gymcana-active-workout'


function createInitialSession(): SessionState {
  const routineId = getSelectedRoutineId()
  const routine =
    getRoutineById(routineId) ?? getRoutines()[0]

  return {
    routineId: routine.id,
    routineName: routine.name,
    exercises: routine.exercises.map((exercise, index) => ({
      id: index + 1,
      name: exercise.name,
      muscle: exercise.muscle,
      targetReps: exercise.targetReps,
      sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
        id: setIndex + 1,
        reps: 10,
        weight: exercise.referenceWeight,
        status: 'pending' as SetStatus,
      })),
    })),
    currentExerciseIndex: 0,
    elapsedSeconds: 0,
    restSeconds: 0,
  }
}

function loadSession(): SessionState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SessionState>

      if (Array.isArray(parsed.exercises)) {
        const routineId = parsed.routineId ?? getSelectedRoutineId()
        const routine = getRoutineById(routineId)

        return {
          ...parsed,
          routineId,
          routineName: parsed.routineName ?? routine?.name ?? 'Treino',
          currentExerciseIndex: parsed.currentExerciseIndex ?? 0,
          elapsedSeconds: parsed.elapsedSeconds ?? 0,
          restSeconds: parsed.restSeconds ?? 0,
        } as SessionState
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }

  return createInitialSession()
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function WorkoutSessionPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionState>(loadSession)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showExerciseList, setShowExerciseList] = useState(false)
  const [showFinish, setShowFinish] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const [formWeight, setFormWeight] = useState(0)
  const [formReps, setFormReps] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentExercise =
    session.exercises[session.currentExerciseIndex]

  const currentSet = currentExercise?.sets.find(
    (set) => set.status === 'pending',
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

  const totalSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  )

  const progress = totalSets > 0 ? (completedSets + skippedSets) / totalSets * 100 : 0

  const lastCompletedSet = currentExercise?.sets
    .filter((set) => set.status === 'completed')
    .at(-1)

  useEffect(() => {
  if (finished) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}, [session, finished])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSession((current) => ({
        ...current,
        elapsedSeconds: current.elapsedSeconds + 1,
        restSeconds: Math.max(0, current.restSeconds - 1),
      }))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  function openRegistration() {
    if (!currentSet) return

    setFormWeight(currentSet.weight)
    setFormReps(currentSet.reps)
    setShowRegistration(true)
  }

  function registerSet() {
    if (!currentSet || formWeight < 0 || formReps < 1) return

    setSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === currentExercise.id
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === currentSet.id
                  ? {
                      ...set,
                      weight: formWeight,
                      reps: formReps,
                      status: 'completed',
                    }
                  : set,
              ),
            }
          : exercise,
      ),
      restSeconds: 90,
    }))

    setShowRegistration(false)
  }

  function skipSet() {
    if (!currentSet) return

    setSession((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === currentExercise.id
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === currentSet.id
                  ? { ...set, status: 'skipped' }
                  : set,
              ),
            }
          : exercise,
      ),
    }))
  }


  function changeExercise(direction: number) {
    const nextIndex = session.currentExerciseIndex + direction

    if (nextIndex < 0 || nextIndex >= session.exercises.length) return

    setSession((current) => ({
      ...current,
      currentExerciseIndex: nextIndex,
      restSeconds: 0,
    }))
  }

  function selectExercise(index: number) {
    setSession((current) => ({
      ...current,
      currentExerciseIndex: index,
      restSeconds: 0,
    }))
    setShowExerciseList(false)
  }

  function finishWorkout() {
    saveCompletedWorkout(session)
    setFinished(true)
    setShowFinish(false)
  }

  function exitWorkout() {
    navigate('/training')
}

  if (finished) {
    return (
      <div className={styles.page}>
        <Card className={styles.finishedCard}>
          <div className={styles.finishedIcon}>
            <Check size={30} />
          </div>
          <span className={styles.eyebrow}>SESSÃO CONCLUÍDA</span>
          <h1>Bom trabalho!</h1>
          <p>Seu treino foi finalizado.</p>

          <div className={styles.summary}>
            <div>
              <strong>{completedSets}</strong>
              <span>Séries realizadas</span>
            </div>
            <div>
              <strong>{formatTime(session.elapsedSeconds)}</strong>
              <span>Tempo de treino</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/training')}
          >
            Voltar para Treino
          </button>
        </Card>
      </div>
    )
  }

  if (!currentExercise) {
  return (
    <div className={styles.page}>
      <Card className={styles.finishedCard}>
        <h2>Rotina sem exercícios</h2>
        <p>Adicione exercícios à rotina antes de iniciar o treino.</p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => navigate('/training')}
        >
          Voltar para Treino
        </button>
      </Card>
    </div>
  )
}

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setShowExit(true)}
          aria-label="Sair do treino"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={styles.topInfo}>
          <strong>{session.routineName.toUpperCase()}</strong>
          <span>{formatTime(session.elapsedSeconds)}</span>
        </div>

        <button
          type="button"
          className={styles.finishTextButton}
          onClick={() => setShowFinish(true)}
        >
          Finalizar
        </button>
      </header>

      <div className={styles.progressArea}>
        <div className={styles.progressTrack}>
          <div style={{ width: `${progress}%` }} />
        </div>
        <span>{completedSets} de {totalSets} séries concluídas</span>
      </div>

      <main className={styles.focus}>
        <button
          type="button"
          className={styles.exerciseSelector}
          onClick={() => setShowExerciseList((current) => !current)}
        >
          <span>EXERCÍCIO {session.currentExerciseIndex + 1} DE {session.exercises.length}</span>
          <ChevronDown size={16} />
        </button>

        {showExerciseList && (
          <Card className={styles.exerciseMenu}>
            {session.exercises.map((exercise, index) => (
              <button
                type="button"
                key={exercise.id}
                onClick={() => selectExercise(index)}
                className={index === session.currentExerciseIndex ? styles.selectedExercise : ''}
              >
                <span>{index + 1}. {exercise.name}</span>
                <span>
                  {exercise.sets.filter((set) => set.status === 'completed').length}/{exercise.sets.length}
                </span>
              </button>
            ))}
          </Card>
        )}

        <div className={styles.exerciseTitle}>
          <h1>{currentExercise.name}</h1>
          <span>{currentExercise.muscle}</span>
        </div>

        <Card className={styles.lastSetCard}>
          <span>ÚLTIMA SÉRIE REALIZADA</span>
          {lastCompletedSet ? (
            <strong>{lastCompletedSet.weight} kg × {lastCompletedSet.reps} reps</strong>
          ) : (
            <strong className={styles.muted}>Ainda não registrada</strong>
          )}
        </Card>

        <section className={styles.currentSet}>
          <span className={styles.setEyebrow}>
            {currentSet
              ? `SÉRIE ${currentExercise.sets.filter((set) => set.status !== 'skipped').findIndex((set) => set.id === currentSet.id) + 1} DE ${currentExercise.sets.length}`
              : 'EXERCÍCIO CONCLUÍDO'}
          </span>

          {currentSet ? (
            <>
              <strong className={styles.repTarget}>{currentExercise.targetReps}</strong>
              <span className={styles.repLabel}>REPETIÇÕES</span>
              <div className={styles.weightReference}>
                <Dumbbell size={17} />
                <strong>{currentSet.weight} kg</strong>
                <span>carga de referência</span>
              </div>
            </>
          ) : (
            <strong className={styles.exerciseDone}>Todas as séries resolvidas</strong>
          )}
        </section>

        {session.restSeconds > 0 && (
            <Card className={styles.restCard}>
                <div>
                <span>DESCANSO</span>
                <strong>{formatTime(session.restSeconds)}</strong>
                </div>

                <button
                type="button"
                onClick={() =>
                    setSession((current) => ({
                    ...current,
                    restSeconds: 0,
                    }))
                }
                >
                Pular descanso
                </button>
            </Card>
            )}

        {currentSet && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={openRegistration}
            >
              <Check size={18} />
              Registrar série
            </button>

            <div className={styles.secondaryActions}>
              <button type="button" onClick={skipSet}>
                <Minus size={16} />
                Pular série
              </button>
            </div>
          </div>
        )}

        {!currentSet && (
            <button
                type="button"
                className={styles.primaryButton}
                onClick={() => changeExercise(1)}
                disabled={session.currentExerciseIndex === session.exercises.length - 1}
            >
                Próximo exercício <ArrowRight size={18} />
            </button>
            )}
      </main>

      <footer className={styles.bottomBar}>
        <button
          type="button"
          onClick={() => changeExercise(-1)}
          disabled={session.currentExerciseIndex === 0}
        >
          <ArrowLeft size={17} />
          Anterior
        </button>
        <button
          type="button"
          onClick={() => changeExercise(1)}
          disabled={session.currentExerciseIndex === session.exercises.length - 1}
        >
          Próximo
          <ArrowRight size={17} />
        </button>
      </footer>

      {showRegistration && currentSet && (
        <div className={styles.modalBackdrop}>
          <Card className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>REGISTRO DA SÉRIE</span>
                <h2>Como foi?</h2>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setShowRegistration(false)}
                aria-label="Fechar registro"
              >
                <X size={20} />
              </button>
            </div>

            <p className={styles.modalDescription}>
              Meta: {currentExercise.targetReps} repetições
            </p>

            <div className={styles.formFields}>
              <label>
                Carga (kg)
                <div className={styles.numberControl}>
                  <button
                    type="button"
                    onClick={() => setFormWeight((value) => Math.max(0, value - 1))}
                    aria-label="Diminuir carga"
                  >
                    <Minus size={17} />
                  </button>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formWeight}
                    onChange={(event) => setFormWeight(Number(event.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => setFormWeight((value) => value + 1)}
                    aria-label="Aumentar carga"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </label>

              <label>
                Repetições
                <div className={styles.numberControl}>
                  <button
                    type="button"
                    onClick={() => setFormReps((value) => Math.max(1, value - 1))}
                    aria-label="Diminuir repetições"
                  >
                    <Minus size={17} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={formReps}
                    onChange={(event) => setFormReps(Number(event.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => setFormReps((value) => value + 1)}
                    aria-label="Aumentar repetições"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </label>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={registerSet}
              disabled={formWeight < 0 || formReps < 1}
            >
              Confirmar série
            </button>
          </Card>
        </div>
      )}

      {showExit && (
        <div className={styles.modalBackdrop}>
          <Card className={styles.confirmModal}>
            <h2>Sair do treino?</h2>
            <p>Seu progresso será salvo neste dispositivo e você poderá continuar depois.</p>
            <button type="button" className={styles.primaryButton} onClick={exitWorkout}>
              Sair e salvar
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setShowExit(false)}>
              Continuar treinando
            </button>
          </Card>
        </div>
      )}

      {showFinish && (
        <div className={styles.modalBackdrop}>
          <Card className={styles.confirmModal}>
            <h2>Finalizar sessão?</h2>
            <p>
              Você registrou {completedSets} séries e pulou {skippedSets}.
              Ao finalizar, a sessão será encerrada.
            </p>
            <button type="button" className={styles.primaryButton} onClick={finishWorkout}>
              Finalizar treino
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setShowFinish(false)}>
              Voltar ao treino
            </button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default WorkoutSessionPage
