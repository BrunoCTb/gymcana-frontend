import styles from './HomePage.module.css'

function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>SEGUNDA-FEIRA, 17 DE NOVEMBRO</span>
          <h1>Seu dia, em foco.</h1>
          <p>Acompanhe seu progresso e mantenha o ritmo.</p>
        </div>
      </section>

      <section className={styles.overview}>
        <article className={styles.card}>
          <span className={styles.cardLabel}>Nutrição</span>
          <strong className={styles.mainValue}>1.680 <small>kcal</small></strong>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '65%' }} />
          </div>
          <span className={styles.supportText}>1.920 kcal restantes</span>
        </article>

        <article className={styles.card}>
          <span className={styles.cardLabel}>Treino</span>
          <strong className={styles.mainValue}>Upper A</strong>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            Programado para hoje
          </span>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>Seu treino</h2>
          <span className={styles.sectionAction}>Ver rotina</span>
        </div>

        <article className={styles.card}>
          <div className={styles.workoutHeader}>
            <div>
              <span className={styles.cardLabel}>ROTINA DE HOJE</span>
              <h3>Upper A</h3>
              <p>Peito, costas, ombros e braços</p>
            </div>
            <span className={styles.workoutIcon}>↗</span>
          </div>

          <div className={styles.workoutFooter}>
            <span>8 exercícios</span>
            <span>•</span>
            <span>Volume moderado</span>
          </div>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>Nutrição</h2>
          <span className={styles.sectionAction}>Ver detalhes</span>
        </div>

        <article className={styles.card}>
          <div className={styles.nutritionHeader}>
            <div>
              <span className={styles.cardLabel}>CONSUMO DE HOJE</span>
              <strong className={styles.mainValue}>1.680 <small>/ 2.600 kcal</small></strong>
            </div>
            <span className={styles.nutritionPercentage}>65%</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '65%' }} />
          </div>

          <div className={styles.macroList}>
            <div>
              <span>Proteínas</span>
              <strong>112 g</strong>
            </div>
            <div>
              <span>Carboidratos</span>
              <strong>185 g</strong>
            </div>
            <div>
              <span>Gorduras</span>
              <strong>48 g</strong>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>Outros indicadores</h2>
        </div>

        <div className={styles.secondaryGrid}>
          <article className={styles.card}>
            <span className={styles.cardLabel}>Hidratação</span>
            <strong className={styles.secondaryValue}>1,2 L</strong>
            <span className={styles.supportText}>de 2,5 L</span>
          </article>

          <article className={styles.card}>
            <span className={styles.cardLabel}>Peso atual</span>
            <strong className={styles.secondaryValue}>73,0 kg</strong>
            <span className={styles.supportText}>Último registro</span>
          </article>
        </div>
      </section>
    </div>
  )
}

export default HomePage
