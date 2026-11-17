import { BrowserRouter, Routes, Route } from 'react-router'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../../modules/home/pages/HomePage'
import NotFoundPage from '../../modules/home/pages/NotFoundPage'
import PlaceholderPage from '../../modules/home/pages/PlaceholderPage'
import TrainingPage from '../../modules/training/pages/TrainingPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route 
            path="/" 
            element={<HomePage />} 
            />
          <Route 
            path="/training" 
            element={<TrainingPage />} 
          />
          <Route
            path="/nutrition"
            element={<PlaceholderPage title="Dieta" />}
          />
          <Route
            path="/progress"
            element={<PlaceholderPage title="Evolução" />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter