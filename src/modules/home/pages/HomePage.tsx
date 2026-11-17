import { Link } from 'react-router'

function HomePage() {
  return (
    <main>
      <h1>Gymcana</h1>
      <p>Seu espaço de evolução.</p>

      <Link to="/about">Conhecer o projeto</Link>
    </main>
  )
}

export default HomePage