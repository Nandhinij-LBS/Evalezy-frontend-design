import { useState } from 'react'
import type { LibraryGoal } from '../types'

interface GoalLibraryModalProps {
  goals: LibraryGoal[]
  selectedId?: string
  onSelect: (goal: LibraryGoal) => void
  onClose: () => void
}

export default function GoalLibraryModal({
  goals,
  selectedId,
  onSelect,
  onClose,
}: GoalLibraryModalProps) {
  const [query, setQuery] = useState('')

  const filtered = goals.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-20">
      <div className="bg-white w-full rounded-t-2xl p-4 sm:p-5 max-h-[75vh] overflow-y-auto">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Goal Library</h2>
          <button onClick={onClose} aria-label="Close" className="min-h-11 min-w-11 flex items-center justify-center text-gray-400">
            <CloseIcon />
          </button>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search predefined goals..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-brand"
          />
        </div>

        <div className="space-y-2.5">
          {filtered.map((g) => {
            const isSelected = g.id === selectedId
            return (
              <div
                key={g.id}
                className={`w-full text-left border rounded-xl p-3 flex items-center justify-between gap-3 ${
                  isSelected ? 'border-teal-brand' : 'border-gray-200'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{g.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{g.description}</p>
                </div>
                <button
                  onClick={() => onSelect(g)}
                  className={`shrink-0 min-h-11 flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-full ${
                    isSelected
                      ? 'bg-teal-brand/10 text-teal-brand'
                      : 'bg-teal-brand text-white'
                  }`}
                >
                  {isSelected && <CheckIcon />}
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No matching goals.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
