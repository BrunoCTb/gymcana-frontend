import { BrowserRouter, Routes, Route } from 'react-router'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../../modules/home/pages/HomePage'
import NotFoundPage from '../../modules/home/pages/NotFoundPage'
import TrainingPage from '../../modules/training/pages/TrainingPage'
import NutritionPage from '../../modules/nutrition/pages/NutritionPage'
import ProgressPage from '../../modules/progress/pages/ProgressPage'
import WorkoutSessionPage from '../../modules/training/pages/WorkoutSessionPage'
import RoutineEditorPage from '../../modules/training/pages/RoutineEditorPage'
import ExerciseHistoryPage from '../../modules/progress/pages/ExerciseHistoryPage'
import WorkoutHistoryPage from '../../modules/progress/pages/WorkoutHistoryPage'
import ExerciseHistoryDetailPage from '../../modules/progress/pages/ExerciseHistoryDetailPage'

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
            element={<NutritionPage />} 
          />
          <Route 
            path="/progress" 
            element={<ProgressPage />} 
          />
          <Route 
            path="/training/session" 
            element={<WorkoutSessionPage />}
          />
          <Route 
          path="/training/routines/:routineId" 
          element={<RoutineEditorPage />}
          />
          <Route
            path="/progress/exercises"
            element={<ExerciseHistoryPage />}
          />
          <Route
            path="/progress/workouts"
            element={<WorkoutHistoryPage />}
          />
          <Route
            path="/progress/exercises/:exerciseId"
            element={<ExerciseHistoryDetailPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter