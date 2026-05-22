import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AchievementsPage from './pages/AchievementsPage'
import LessonsPage from './pages/LessonsPage'
import LessonItemsPage from './pages/LessonItemsPage'
import LessonPlayPage from './pages/LessonPlayPage'
import ResultPage from './pages/ResultPage'
import HomePage from './pages/HomePage'
import TestPage from './pages/TestPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonItemsPage />} />
        <Route path="/lessons/:id/:itemLabel" element={<LessonPlayPage />} />
        <Route path="/result/:id/:itemLabel" element={<ResultPage />} />
        <Route path="/draw" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
