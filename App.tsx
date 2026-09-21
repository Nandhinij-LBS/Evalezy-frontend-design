import { useEffect } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import GoalsListPage from './pages/GoalsListPage'
import AddGoalPage from './pages/AddGoalPage'
import GoalDetailPage from './pages/GoalDetailPage'
import ProfilePage from './pages/ProfilePage'
import { ensureDefaultEmployees, isAuthenticated } from './services/api'

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  useEffect(() => {
    ensureDefaultEmployees()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/goals"
        element={
          <RequireAuth>
            <GoalsListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/goals/add"
        element={
          <RequireAuth>
            <AddGoalPage />
          </RequireAuth>
        }
      />
      <Route
        path="/goals/:goalId/edit"
        element={
          <RequireAuth>
            <AddGoalPage />
          </RequireAuth>
        }
      />
      <Route
        path="/goals/:goalId"
        element={
          <RequireAuth>
            <GoalDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App