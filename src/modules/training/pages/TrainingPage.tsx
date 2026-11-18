
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import styles from './TrainingPage.module.css'
import { Link } from 'react-router'

const exercises = [
  {
    name: 'Supino inclinado com halteres',
    muscle: 'Peito superior',
    sets: '3 séries',
    reps: '8–12 reps',
    load: '22 kg',
  },
  {
    name: 'Puxada alta aberta',
    muscle: 'Costas',
    sets: '3 séries',
    reps: '8–12 reps',
    load: '45 kg',
  },
  {
    name: 'Desenvolvimento máquina',
    muscle: 'Ombros',
    sets: '3 séries',
    reps: '8–12 reps',
    load: '30 kg',
  },
  {
    name: 'Rosca Scott',
    muscle: 'Bíceps',
    sets: '3 séries',
    reps: '8–12 reps',
    load: '20 kg',
  },
  {
    name: 'Tríceps corda',
    muscle: 'Tríceps',
    sets: '3 séries',
    reps: '10–12 reps',
    load: '25 kg',
  },
]

function TrainingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <Link to="/training/session">
          Iniciar treino
        </Link>
        <div>
          <span className={styles.eyebrow}>SEU TREINAMENTO</span>
          <h1>Treino</h1>
          <p>Gerencie suas rotinas e acompanhe sua evolução.</p>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Minhas rotinas" />

        <div className={styles.routineList}>
          <Card>
            <div className={styles.routineHeader}>
              <div>
                <span className={styles.activeLabel}>ROTINA ATUAL</span>
                <h2>Upper A</h2>
                <p>Peito, costas, ombros e braços</p>
              </div>
              <span className={styles.routineBadge}>A</span>
            </div>

            <div className={styles.routineFooter}>
              <span>8 exercícios</span>
              <span>•</span>
              <span>Treino superior</span>
            </div>
          </Card>

          <Card>
            <div className={styles.routineHeader}>
              <div>
                <span className={styles.cardLabel}>ROTINA</span>
                <h2>Lower</h2>
                <p>Pernas, glúteos e panturrilhas</p>
              </div>
              <span className={styles.routineBadge}>B</span>
            </div>

            <div className={styles.routineFooter}>
              <span>6 exercícios</span>
              <span>•</span>
              <span>Treino inferior</span>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Upper A" action="Editar rotina" />

        <div className={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <Card key={exercise.name}>
              <div className={styles.exercise}>
                <div className={styles.exerciseNumber}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className={styles.exerciseInfo}>
                  <h3>{exercise.name}</h3>
                  <span>{exercise.muscle}</span>

                  <div className={styles.exerciseDetails}>
                    <span>{exercise.sets}</span>
                    <span>{exercise.reps}</span>
                  </div>
                </div>

                <div className={styles.load}>
                  <strong>{exercise.load}</strong>
                  <span>Última carga</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TrainingPage
