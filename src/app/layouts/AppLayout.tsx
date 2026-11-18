
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import MainNavigation from '../../components/navigation/MainNavigation'
import styles from './AppLayout.module.css'

type Theme = 'dark' | 'light'

function AppLayout() {
  const location = useLocation()
  const isWorkoutSession = location.pathname === '/training/session'

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('gymcana-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gymcana-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={styles.app}>
      {!isWorkoutSession && (
        <>
          <header className={styles.header}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>G</span>
              <span>Gymcana</span>
            </Link>

            <button
              type="button"
              className={styles.themeButton}
              onClick={toggleTheme}
              aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </header>

          <MainNavigation />
        </>
      )}

      <main className={isWorkoutSession ? styles.sessionMain : styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
