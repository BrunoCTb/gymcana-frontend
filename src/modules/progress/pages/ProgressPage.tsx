
import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import styles from './ProgressPage.module.css'

const weightHistory = [
  { date: '01/10', weight: 72.4 },
  { date: '08/10', weight: 72.8 },
  { date: '15/10', weight: 72.6 },
  { date: '22/10', weight: 73.1 },
  { date: '29/10', weight: 73.3 },
  { date: '05/11', weight: 73.2 },
  { date: '12/11', weight: 73.6 },
]

const measurements = [
  { name: 'Braço', value: '34 cm', date: '12/11/2026' },
  { name: 'Peito', value: '99 cm', date: '12/11/2026' },
  { name: 'Cintura', value: '75 cm', date: '12/11/2026' },
  { name: 'Coxa', value: '57 cm', date: '12/11/2026' },
  { name: 'Panturrilha', value: '38 cm', date: '12/11/2026' },
]

const assessments = [
  { date: '12 nov 2026', title: 'Avaliação corporal', description: 'Peso e medidas atualizados' },
  { date: '29 out 2026', title: 'Avaliação corporal', description: 'Peso e medidas atualizados' },
  { date: '15 out 2026', title: 'Avaliação corporal', description: 'Primeiro registro do período' },
]

type Period = '1M' | '3M' | '6M' | '1A'

function ProgressPage() {
  const [period, setPeriod] = useState<Period>('1M')

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>ACOMPANHAMENTO</span>
          <h1>Evolução</h1>
          <p>Acompanhe suas mudanças ao longo do tempo.</p>
        </div>
      </header>

      <section className={styles.overview}>
        <Card className={styles.weightCard}>
          <span className={styles.cardLabel}>Peso atual</span>
          <div className={styles.weightValue}>
            <strong>73,6</strong>
            <span>kg</span>
          </div>
          <span className={styles.variation}>+1,2 kg no período</span>
        </Card>

        <Card className={styles.summaryCard}>
          <span className={styles.cardLabel}>Última avaliação</span>
          <strong>12 nov</strong>
          <span className={styles.muted}>Há 5 dias</span>
        </Card>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Histórico de peso" />
        <Card className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <span className={styles.cardLabel}>Variação do peso</span>
              <strong className={styles.chartValue}>73,6 kg</strong>
            </div>

            <div className={styles.periodSelector}>
              {(['1M', '3M', '6M', '1A'] as Period[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={period === item ? styles.activePeriod : ''}
                  onClick={() => setPeriod(item)}
                  aria-pressed={period === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    color: 'var(--color-text)',
                  }}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.chartNote}>
            Dados ilustrativos. O seletor de período será conectado ao histórico real posteriormente.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Medidas corporais" action="Ver todas" />
        <Card className={styles.measurementsCard}>
          {measurements.map((measurement) => (
            <div className={styles.measurementRow} key={measurement.name}>
              <div>
                <strong>{measurement.name}</strong>
                <span>{measurement.date}</span>
              </div>
              <strong className={styles.measurementValue}>{measurement.value}</strong>
            </div>
          ))}
        </Card>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Registros anteriores" action="Ver histórico" />
        <Card className={styles.historyCard}>
          {assessments.map((assessment) => (
            <div className={styles.historyRow} key={assessment.date}>
              <div className={styles.historyMarker} />
              <div className={styles.historyContent}>
                <strong>{assessment.title}</strong>
                <span>{assessment.description}</span>
              </div>
              <time>{assessment.date}</time>
            </div>
          ))}
        </Card>
      </section>
    </div>
  )
}

export default ProgressPage
