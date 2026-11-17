import { NavLink } from 'react-router'

function MainNavigation() {
  return (
    <nav>
      <NavLink to="/">Início</NavLink>
      <NavLink to="/training">Treino</NavLink>
      <NavLink to="/nutrition">Dieta</NavLink>
      <NavLink to="/progress">Evolução</NavLink>
    </nav>
  )
}

export default MainNavigation