import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import GoalCard from '../components/GoalCard'
import HomeIndicator from '../components/HomeIndicator'
import StatusBadge from '../components/StatusBadge'
import StatusBarMock from '../components/StatusBarMock'
import EmptyStateIllustration from '../components/EmptyStateIllustration'
import { getCurrentUser, getGoals, submitGoalForReview } from '../services/api'
import type { Goal } from '../types'

// Single place that decides which goals are shown: only goals whose
// employeeId matches the currently signed-in employee.
async function loadSignedInEmployeeGoals(): Promise<Goal[]> {
  const employeeId = String(getCurrentUser()?.id ?? '')
  if (!employeeId) return []
  const allGoals = await getGoals()
  return allGoals.filter((goal) => String(goal.employeeId) === employeeId)
}

export default function GoalsListPage() {
  const navigate = useNavigate()
  const currentEmployee = getCurrentUser()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSignedInEmployeeGoals()
      .then(setGoals)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load goals')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      for (const goal of goals) {
        if (goal.status !== 'submitted') {
          await submitGoalForReview(goal.id, '')
        }
      }
      // Reload through the same employee-scoped loader (previously this
      // used getGoals() directly, which skipped the employee filter).
      setGoals(await loadSignedInEmployeeGoals())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit goals')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white pb-10">
      <div className="bg-white border-b border-[#F2F4F7]">
        <StatusBarMock />
        <header className="flex items-center gap-3 px-4 pt-3 pb-4 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Go back"
            className="w-9 h-9 rounded-full border border-teal-brand/30 flex items-center justify-center text-teal-brand shrink-0"
          >
            <BackArrowIcon />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">My Goals</h1>
            <div className="mt-1.5">
              <StatusBadge label="Yet to submit" tone="warning" />
            </div>
          </div>
          <Avatar src={currentEmployee?.avatarUrl ?? ''} name={currentEmployee?.name ?? 'Employee'} className="w-10 h-10 shrink-0 ml-auto" />
        </header>
      </div>

      <div className="flex-1 bg-[#F9FAFB] px-4 pt-4 sm:px-5">
        <button
          onClick={() => navigate('/goals/add')}
          className="w-full min-h-10 flex items-center justify-center gap-2 bg-teal-brand text-white text-[11px] font-semibold rounded-full py-2.5"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Goal</span>
        </button>

        <div className="mt-5">
          {loading ? (
            <p className="text-sm text-gray-400 text-center mt-10">Loading goals...</p>
          ) : error ? (
            <p className="text-sm text-red-600 text-center mt-10">{error}</p>
          ) : goals.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full min-h-10 bg-green-600 text-white rounded-full py-2.5 text-[11px] font-semibold mt-4"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center mt-10 px-4">
      <EmptyStateIllustration />
      <h3 className="font-bold text-gray-900 text-lg mt-2">No goals yet</h3>
      <p className="text-sm text-gray-500 mt-1.5 max-w-[26ch] leading-relaxed">
        No goals found for this employee. Tap Add Goal to create your first goal.
      </p>
    </div>
  )
}