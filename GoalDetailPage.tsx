import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import HomeIndicator from '../components/HomeIndicator'
import StatusBarMock from '../components/StatusBarMock'
import { getCurrentUser, getGoalById, submitGoalForReview } from '../services/api'
import type { Goal } from '../types'

export default function GoalDetailPage() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const [goal, setGoal] = useState<Goal | null | undefined>(undefined)
  const [showSubmit, setShowSubmit] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!goalId) return
    getGoalById(goalId)
      .then((g) => setGoal(g ?? null))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load goal'))
  }, [goalId])

  if (goal === undefined) {
    return <p className="p-6 text-center text-red-600 text-sm">{error || 'Loading...'}</p>
  }

  if (goal === null) {
    return (
      <div className="p-6 text-center text-gray-500">
        Goal not found.
        <button onClick={() => navigate('/goals')} className="block mx-auto mt-3 text-teal-brand">
          Back to Goal List
        </button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col relative bg-white">
      {/* header-container: white bg, border-bottom, separate from main-content */}
      <div className="bg-white border-b border-[#F2F4F7]">
        <StatusBarMock />
        <header className="flex items-center gap-3 px-4 py-3 sm:px-5">
          <button
            onClick={() => navigate('/goals')}
            aria-label="Back to Goal List"
            className="w-9 h-9 rounded-full border border-teal-brand/30 flex items-center justify-center text-teal-brand shrink-0"
          >
            <BackArrowIcon />
          </button>
          <h1 className="flex-1 text-sm font-bold text-gray-900">Back to Goal List</h1>
          <Avatar src={getCurrentUser()?.avatarUrl ?? ''} name={getCurrentUser()?.name ?? 'Employee'} className="w-9 h-9 shrink-0" />
        </header>
      </div>

      {/* main-content: separate light-gray background from the white header */}
      <div className="flex-1 bg-[#F9FAFB] px-4 py-3 space-y-4 pb-28 sm:px-5">
        <div className="bg-white border border-[#F2F4F7] rounded-2xl p-3">
          <h2 className="text-sm font-bold text-gray-900">{goal.title}</h2>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <WeightIcon /> {goal.weightPercent}%
            </span>
            <span className="flex items-center gap-1.5">
              <CategoryIcon /> {goal.category}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon /> {new Date(goal.dueDate).toLocaleDateString('en-GB')}
            </span>
          </div>
          <div className="mt-3 space-y-3 text-[10px] leading-relaxed">
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-0.5">Description:</p>
              <p className="text-gray-500">{goal.description || 'No description provided.'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-0.5">Milestones:</p>
              {goal.milestones && goal.milestones.length > 0 ? (
                <ul className="list-disc pl-4 text-gray-500">
                  {goal.milestones.map((milestone) => (
                    <li key={milestone.id}>{milestone.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No milestones defined.</p>
              )}
            </div>
          </div>
          <div className="mt-3 space-y-3 text-[10px] leading-relaxed">
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-0.5">50% Threshold:</p>
              <p className="text-gray-500">{goal.threshold50}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-0.5">100% Target:</p>
              <p className="text-gray-500">{goal.target100}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-0.5">150% Superior:</p>
              <p className="text-gray-500">{goal.superior150}</p>
            </div>
          </div>
        </div>

        {goal.feedback && goal.feedback.length > 0 && (
          <div>
            <p className="text-[9px] font-semibold text-gray-400 tracking-wide mb-2">RECENT FEEDBACK</p>
            {goal.feedback.map((f) => (
              <div key={f.id} className="bg-white border border-[#F2F4F7] rounded-2xl p-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <Avatar src={getCurrentUser()?.avatarUrl ?? ''} name={f.authorName} className="w-9 h-9" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.authorName}</p>
                    <p className="text-xs text-gray-400">{f.timeAgo}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">{f.comment}</p>
                <div className="flex items-center gap-2 mt-3">
                  <StatPill icon={<ThumbIcon />} count={f.likes} />
                  <StatPill icon={<CommentIcon />} count={f.comments} />
                  <StatPill icon={<HeartIcon />} count={f.hearts} />
                </div>
              </div>
            ))}
          </div>
        )}

        {goal.status !== 'submitted' ? (
          <button
            onClick={() => setShowSubmit(true)}
            className="w-full min-h-10 bg-green-600 text-white rounded-full py-2.5 text-[11px] font-semibold"
          >
            Submit for Review
          </button>
        ) : (
          <p className="text-center text-sm font-medium text-green-700 bg-green-50 rounded-full py-3">
            Submitted for review
          </p>
        )}
      </div>

      {/* fab-comment: floats above the fixed bottom-container */}
      <button
        onClick={() => setShowSubmit(true)}
        aria-label="Add comment"
        className="fixed bottom-28 right-4 w-14 h-14 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-lg sm:right-6"
      >
        <CommentPlusIcon />
      </button>

      {/* bottom-container: edit-goal-row + HomeIndicatorContainer, fixed footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F7] px-4 pt-3 sm:px-5">
        <button
          onClick={() => navigate(`/goals/${goal.id}/edit`)}
          className="w-full min-h-11 flex items-center justify-center gap-1.5 bg-[#FAF9F3] border border-gray-200 rounded-full py-2.5 text-sm font-semibold text-[#215D4C]"
        >
          <PencilIcon />
          Edit Goal
        </button>
        <HomeIndicator />
      </div>

      {showSubmit && (
        <SubmitReviewModal
          goal={goal}
          onClose={() => setShowSubmit(false)}
          onSubmitted={() => {
            setShowSubmit(false)
            navigate('/goals')
          }}
        />
      )}
    </div>
  )
}

function StatPill({ icon, count }: { icon: React.ReactNode; count: number }) {
  return (
    <span className="flex items-center gap-1.5 bg-[#FAF9F3] text-gray-600 text-xs font-medium rounded-full px-3 py-1.5">
      {icon} {count}
    </span>
  )
}

function SubmitReviewModal({
  goal,
  onClose,
  onSubmitted,
}: {
  goal: Goal
  onClose: () => void
  onSubmitted: () => void
}) {
  const [comment, setComment] = useState(
    'Goal completed as planned. Final deliverables shared with the marketing team. Received timely inputs from design and content. Ready for review.'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitGoalForReview(goal.id, comment)
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-20 flex flex-col">
      {/* header-container, same treatment as the main Goal Detail header */}
      <div className="bg-white border-b border-[#F2F4F7]">
        <header className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onClose}
            aria-label="Back to Goal List"
            className="w-9 h-9 rounded-full border border-teal-brand/30 flex items-center justify-center text-teal-brand shrink-0"
          >
            <BackArrowIcon />
          </button>
          <h1 className="text-base font-bold text-gray-900">Back to Goal List</h1>
        </header>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pt-4 flex-1 flex flex-col bg-[#F9FAFB]">
        <h2 className="text-xl font-bold text-gray-900">Submit</h2>
        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">
          Please provide a comment before submitting your completed goal for manager review.
        </p>

        <label className="text-sm font-semibold text-gray-800 mb-1.5">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={8}
          className="w-full bg-white border border-[#F2F4F7] rounded-xl px-4 py-3 flex-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-brand"
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </form>

      {/* bottom-container: Submit action + HomeIndicatorContainer */}
      <div className="bg-white border-t border-[#F2F4F7] px-5 pt-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-full py-3.5 font-semibold disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={onClose} className="w-full text-center text-sm font-semibold text-gray-600 py-3">
          Cancel
        </button>
        <HomeIndicator />
      </div>
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
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
function WeightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M8 6h8l3 12a2 2 0 0 1-2 2.5H7A2 2 0 0 1 5 18Z" />
    </svg>
  )
}
function CategoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7v4M6.5 11h11M6.5 11v4M17.5 11v4" />
      <rect x="9.5" y="2.5" width="5" height="4.5" rx="1" />
      <rect x="4" y="15" width="5" height="4.5" rx="1" />
      <rect x="15" y="15" width="5" height="4.5" rx="1" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  )
}
function ThumbIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v11M2 12v7a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-1.6l1.3-6.5A2 2 0 0 0 16.8 10H14V5a2 2 0 0 0-2-2l-3 7H2Z" />
    </svg>
  )
}
function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8.5 8.5 0 1 1-3.9-7.1L21 4l-1 3.9A8.4 8.4 0 0 1 21 12Z" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}
function CommentPlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M12 7v6M9 10h6" />
    </svg>
  )
}