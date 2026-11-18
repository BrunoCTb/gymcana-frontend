
import { NavLink } from 'react-router'
import {
  Activity,
  Apple,
  ChartNoAxesCombined,
  House,
} from 'lucide-react'
import styles from './MainNavigation.module.css'

const navigationItems = [
  { to: '/', label: 'Início', icon: House, end: true },
  { to: '/training', label: 'Treino', icon: Activity },
  { to: '/nutrition', label: 'Dieta', icon: Apple },
  { to: '/progress', label: 'Evolução', icon: ChartNoAxesCombined },
]

function MainNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Navegação principal">
      {navigationItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={20} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MainNavigation
