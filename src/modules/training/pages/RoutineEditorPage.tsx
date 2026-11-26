import type { WorkoutSetType } from '../data/trainingTypes'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import {
  getRoutines,
  saveRoutines,
  setSelectedRoutineId,
  type Routine,
  type RoutineExercise,
} from '../data/trainingStorage'
import {
  addCustomExercise,
  getExerciseLibrary,
  type LibraryExercise,
} from '../data/exerciseLibrary'
import styles from './RoutineEditorPage.module.css'

function RoutineEditorPage() {
  const { routineId } = useParams()
  const navigate = useNavigate()
  const isNew = routineId === 'new'

  const existingRoutine = useMemo(
    () => getRoutines().find((routine) => routine.id === routineId),
    [routineId],
  )

  const [routine, setRoutine] = useState<Routine>(() =>
    existingRoutine ?? {
      id: '',
      name: '',
      description: '',
      category: 'Treino superior',
      exercises: [],
    },
  )

  const [library, setLibrary] = useState(getExerciseLibrary)
  const [search, setSearch] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState<number | ''>('')
  const [setTypes, setSetTypes] = useState<WorkoutSetType[]>(Array(3).fill('working'),)
  const [setTypeLabels, setSetTypeLabels] = useState<string[]>(Array(3).fill(''),)
  const [customName, setCustomName] = useState('')
  const [customMuscle, setCustomMuscle] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)

  const filteredExercises = library.filter((exercise) =>
    `${exercise.name} ${exercise.muscle}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const selectedLibraryExercise = library.find(
    (exercise) => exercise.id === selectedExercise,
  )

  if (!isNew && !existingRoutine) {
    return (
      <div className={styles.page}>
        <h1>Rotina não encontrada</h1>
        <Link to="/training">Voltar para Treino</Link>
      </div>
    )
  }

  function updateSetCount(value: number) {
    const nextSets = Math.max(1, Math.min(20, value || 1))

    setSets(nextSets)

    setSetTypes((current) =>
      Array.from(
        { length: nextSets },
        (_, index) => current[index] ?? 'working',
      ),
    )

    setSetTypeLabels((current) =>
      Array.from(
        { length: nextSets },
        (_, index) => current[index] ?? '',
      ),
    )
  }

  function addExercise(exercise: LibraryExercise) {
    const newExercise: RoutineExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      targetReps: reps.trim() || undefined,
      sets,
      setTypes,
      setTypeLabels,
      referenceWeight: weight === '' ? undefined : weight,
    }

    setRoutine((current) => ({
      ...current,
      exercises: [...current.exercises, newExercise],
    }))

    setSelectedExercise('')
    setSearch('')
    setSets(3)
    setReps('8–12')
    setWeight(0)
    setSetTypes(Array(3).fill('working'))
    setSetTypeLabels(Array(3).fill(''))
  }

  function createCustomExercise() {
    const name = customName.trim()
    const muscle = customMuscle.trim()

    if (!name || !muscle) return

    const exercise: LibraryExercise = {
      id: crypto.randomUUID(),
      name,
      muscle,
    }

    try {
      addCustomExercise(exercise)
      setLibrary(getExerciseLibrary())
      addExercise(exercise)
      setCustomName('')
      setCustomMuscle('')
      setShowCustomForm(false)
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : 'Não foi possível cadastrar.',
      )
    }
  }

  function removeExercise(id: string) {
    setRoutine((current) => ({
      ...current,
      exercises: current.exercises.filter((exercise) => exercise.id !== id),
    }))
  }

  function moveExercise(index: number, direction: number) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= routine.exercises.length) return

    setRoutine((current) => {
      const exercises = [...current.exercises]
      const [moved] = exercises.splice(index, 1)
      exercises.splice(nextIndex, 0, moved)

      return { ...current, exercises }
    })
  }

  function saveRoutine() {
    if (!routine.name.trim()) {
      window.alert('Informe o nome da rotina.')
      return
    }

    if (routine.exercises.length === 0) {
      window.alert('Adicione pelo menos um exercício à rotina.')
      return
    }

    const routines = getRoutines()

    if (isNew) {
      const newRoutine = {
        ...routine,
        id: crypto.randomUUID(),
      }

      saveRoutines([...routines, newRoutine])
      setSelectedRoutineId(newRoutine.id)
    } else {
      saveRoutines(
        routines.map((item) =>
          item.id === routine.id ? routine : item,
        ),
      )
    }

    navigate('/training')
  }

  function deleteRoutine() {
    if (!window.confirm(`Excluir a rotina ${routine.name}?`)) return

    const remaining = getRoutines().filter(
      (item) => item.id !== routine.id,
    )

    if (remaining.length === 0) {
      window.alert('O Gymcana precisa ter pelo menos uma rotina.')
      return
    }

    saveRoutines(remaining)

    if (localStorage.getItem('gymcana-selected-routine') === routine.id) {
      setSelectedRoutineId(remaining[0].id)
    }

    navigate('/training')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/training" className={styles.backLink}>
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <h1>{isNew ? 'Nova rotina' : 'Editar rotina'}</h1>
        <p>Configure os exercícios e parâmetros do treinamento.</p>
      </header>

      <Card>
        <div className={styles.form}>
          <label>
            Nome da rotina
            <input
              value={routine.name}
              onChange={(event) =>
                setRoutine({ ...routine, name: event.target.value })
              }
              placeholder="Ex.: Upper A"
            />
          </label>

          <label>
            Descrição
            <input
              value={routine.description}
              onChange={(event) =>
                setRoutine({ ...routine, description: event.target.value })
              }
              placeholder="Ex.: Peito, costas e braços"
            />
          </label>

          <label>
            Categoria
            <select
              value={routine.category}
              onChange={(event) =>
                setRoutine({ ...routine, category: event.target.value })
              }
            >
              <option>Treino superior</option>
              <option>Treino inferior</option>
              <option>Corpo inteiro</option>
              <option>Personalizado</option>
            </select>
          </label>
        </div>
      </Card>

      <section className={styles.section}>
        <h2>Adicionar exercícios</h2>

        <Card>
          <div className={styles.form}>
            <label>
              Pesquisar na biblioteca
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome do exercício ou músculo..."
              />
            </label>

            <label>
              Exercício
              <select
                value={selectedExercise}
                onChange={(event) => setSelectedExercise(event.target.value)}
              >
                <option value="">Selecione um exercício</option>
                {filteredExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} — {exercise.muscle}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.parameters}>
              {Array.from({ length: sets }, (_, index) => (
              <label key={index}>
                Série {index + 1}
                <select
                  value={setTypes[index] ?? 'working'}
                  onChange={(event) =>
                    setSetTypes((current) =>
                      current.map((type, i) =>
                        i === index
                          ? (event.target.value as WorkoutSetType)
                          : type,
                      ),
                    )
                  }
                >
                  <option value="warmup">Aquecimento</option>
                  <option value="preparation">Preparação</option>
                  <option value="working">Trabalho</option>
                  <option value="custom">Personalizada</option>
                </select>

                <input
                  value={setTypeLabels[index] ?? ''}
                  onChange={(event) =>
                    setSetTypeLabels((current) =>
                      current.map((label, i) =>
                        i === index ? event.target.value : label,
                      ),
                    )
                  }
                  placeholder="Nome opcional (ex.: Aquecimento 1)"
                />
              </label>
              ))}

              <label>
                Séries
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={sets}
                  onChange={(event) => updateSetCount(Number(event.target.value))}
                />
              </label>

              
              <label>
                Repetições
                <input
                  value={reps}
                  onChange={(event) => setReps(event.target.value)}
                  placeholder="Opcional. Ex.: 8–12"
                />
              </label>

              <label>
                Carga de referência (kg)
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={weight}
                  onChange={(event) =>
                    setWeight(event.target.value === '' ? '' : Number(event.target.value))
                  }
                  placeholder="Opcional"
                />
              </label>

            </div>

            <button
              type="button"
              className={styles.primaryButton}
              disabled={!selectedLibraryExercise || sets < 1}
              onClick={() => selectedLibraryExercise && addExercise(selectedLibraryExercise)}
            >
              <Plus size={17} />
              Adicionar à rotina
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setShowCustomForm((current) => !current)}
            >
              Criar exercício personalizado
            </button>

            {showCustomForm && (
              <div className={styles.customForm}>
                <h3>Novo exercício</h3>

                <label>
                  Nome
                  <input
                    value={customName}
                    onChange={(event) => setCustomName(event.target.value)}
                    placeholder="Ex.: Tríceps testa"
                  />
                </label>

                <label>
                  Grupo muscular
                  <input
                    value={customMuscle}
                    onChange={(event) => setCustomMuscle(event.target.value)}
                    placeholder="Ex.: Tríceps"
                  />
                </label>

                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={!customName.trim() || !customMuscle.trim() || sets < 1}
                  onClick={createCustomExercise}
                  
                >
                  Criar e adicionar
                </button>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2>Exercícios da rotina ({routine.exercises.length})</h2>

        {routine.exercises.length === 0 ? (
          <Card>
            <p>Nenhum exercício adicionado ainda.</p>
          </Card>
        ) : (
          <div className={styles.exerciseList}>
            {routine.exercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <div className={styles.exercise}>
                  <div className={styles.exerciseInfo}>
                    <strong>{index + 1}. {exercise.name}</strong>
                    <span>{exercise.muscle}</span>
                    <span>
                      {exercise.sets} séries
                      {' · '}
                      {exercise.targetReps || 'Reps não definidas'}
                      {' · '}
                      {exercise.referenceWeight !== undefined
                        ? `${exercise.referenceWeight} kg`
                        : 'Carga não definida'}
                    </span>
                  </div>

                  <div className={styles.exerciseActions}>
                    <button
                      type="button"
                      onClick={() => moveExercise(index, -1)}
                      disabled={index === 0}
                      aria-label="Mover para cima"
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExercise(index, 1)}
                      disabled={index === routine.exercises.length - 1}
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      aria-label="Remover exercício"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={saveRoutine}
        >
          Salvar rotina
        </button>

        {!isNew && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={deleteRoutine}
          >
            Excluir rotina
          </button>
        )}
      </div>
    </div>
  )
}

export default RoutineEditorPage
