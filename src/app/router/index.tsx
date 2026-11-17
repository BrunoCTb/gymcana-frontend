import { BrowserRouter, Routes, Route } from 'react-router'
import HomePage from '../../modules/home/pages/HomePage'
import AboutPage from '../../modules/home/pages/AboutPage'
import NotFoundPage from '../../modules/home/pages/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter