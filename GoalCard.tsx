import { useNavigate } from 'react-router-dom'
import type { Goal } from '../types'

export default function GoalCard({ goal }: { goal: Goal }) {
  const navigate = useNavigate()
  const formattedDate = new Date(goal.dueDate).toLocaleDateString('en-GB')

  return (
    <button
      onClick={() => navigate(`/goals/${goal.id}`)}
      className="w-full min-h-14 text-left border border-[#E5E7EB] rounded-xl px-3 py-2.5 active:bg-gray-50 bg-white"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="min-w-0 break-words font-semibold text-gray-900 text-[11px] leading-tight">{goal.title}</h3>
        <ChevronIcon />
      </div>

      <div className="border-t border-gray-100 my-1.5" />

      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[9px] text-gray-500">
        <span className="flex items-center gap-1">
          <WeightIcon /> {goal.weightPercent}%
        </span>
        <span className="flex items-center gap-1">
          <CategoryIcon /> {goal.category}
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon /> {formattedDate}
        </span>
      </div>
    </button>
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
function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}