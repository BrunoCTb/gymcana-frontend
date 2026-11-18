
import { useState } from 'react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import styles from './NutritionPage.module.css'

const meals = [
  {
    name: 'Café da manhã',
    time: '11:00',
    calories: 420,
    foods: [
      { name: 'Ovos inteiros', quantity: '2 unidades', calories: 140 },
      { name: 'Banana', quantity: '100 g', calories: 89 },
      { name: 'Aveia', quantity: '40 g', calories: 156 },
      { name: 'Leite integral', quantity: '100 ml', calories: 61 },
    ],
  },
  {
    name: 'Almoço',
    time: '15:00',
    calories: 650,
    foods: [
      { name: 'Peito de frango', quantity: '200 g', calories: 330 },
      { name: 'Arroz cozido', quantity: '250 g', calories: 320 },
    ],
  },
  {
    name: 'Lanche',
    time: '18:00',
    calories: 310,
    foods: [
      { name: 'Whey protein', quantity: '1 dose', calories: 130 },
      { name: 'Banana', quantity: '2 unidades', calories: 180 },
    ],
  },
  {
    name: 'Jantar',
    time: '21:00',
    calories: 300,
    foods: [
      { name: 'Peito de frango', quantity: '150 g', calories: 248 },
      { name: 'Arroz cozido', quantity: '40 g', calories: 52 },
    ],
  },
]

const weekdays = [
  { day: 'SEG', date: '16' },
  { day: 'TER', date: '17' },
  { day: 'QUA', date: '18' },
  { day: 'QUI', date: '19' },
  { day: 'SEX', date: '20' },
  { day: 'SÁB', date: '21' },
  { day: 'DOM', date: '22' },
]

function NutritionPage() {
  const [selectedDay, setSelectedDay] = useState('17')
  const [expandedMeals, setExpandedMeals] = useState<string[]>(['Café da manhã'])

  function toggleMeal(name: string) {
    setExpandedMeals((current) =>
      current.includes(name)
        ? current.filter((meal) => meal !== name)
        : [...current, name],
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>ACOMPANHAMENTO ALIMENTAR</span>
          <h1>Nutrição</h1>
          <p>Organize sua alimentação e acompanhe suas metas.</p>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Seu consumo" />

        <Card>
          <div className={styles.calorieHeader}>
            <div>
              <span className={styles.cardLabel}>CALORIAS CONSUMIDAS</span>
              <strong className={styles.calorieValue}>1.680</strong>
              <span className={styles.calorieGoal}>de 2.600 kcal</span>
            </div>

            <span className={styles.percentage}>65%</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '65%' }} />
          </div>

          <span className={styles.remaining}>920 kcal restantes</span>

          <div className={styles.macros}>
            <div>
              <span className={styles.macroName}>Proteínas</span>
              <strong>112 g</strong>
              <span>150 g</span>
              <div className={styles.macroTrack}>
                <div style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <span className={styles.macroName}>Carboidratos</span>
              <strong>185 g</strong>
              <span>300 g</span>
              <div className={styles.macroTrack}>
                <div style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <span className={styles.macroName}>Gorduras</span>
              <strong>48 g</strong>
              <span>75 g</span>
              <div className={styles.macroTrack}>
                <div style={{ width: '64%' }} />
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Semana" />

        <div className={styles.week}>
          {weekdays.map((item) => (
            <button
              key={item.date}
              type="button"
              className={`${styles.day} ${selectedDay === item.date ? styles.selectedDay : ''}`}
              onClick={() => setSelectedDay(item.date)}
            >
              <span>{item.day}</span>
              <strong>{item.date}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Refeições" action="Adicionar" />

        <div className={styles.mealList}>
          {meals.map((meal) => {
            const isExpanded = expandedMeals.includes(meal.name)

            return (
              <Card key={meal.name}>
                <button
                  type="button"
                  className={styles.mealButton}
                  onClick={() => toggleMeal(meal.name)}
                  aria-expanded={isExpanded}
                >
                  <div className={styles.mealInfo}>
                    <strong>{meal.name}</strong>
                    <span>{meal.time} · {meal.foods.length} alimentos</span>
                  </div>

                  <div className={styles.mealSummary}>
                    <strong>{meal.calories} kcal</strong>
                    <span>{isExpanded ? '−' : '+'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className={styles.foodList}>
                    {meal.foods.map((food) => (
                      <div className={styles.food} key={food.name}>
                        <div>
                          <strong>{food.name}</strong>
                          <span>{food.quantity}</span>
                        </div>
                        <span>{food.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default NutritionPage
