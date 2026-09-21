import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/goals', label: 'Goals', icon: GoalsIcon },
  { to: '/goals/add', label: 'Add Goal', icon: AddGoalIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/goals'}
              className={({ isActive }) =>
                `flex-1 flex min-h-11 flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${
                  isActive ? 'text-teal-brand' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
      <div className="flex justify-center pt-1 pb-2">
        <div className="w-32 h-1 rounded-full bg-gray-300" />
      </div>
    </nav>
  )
}

function GoalsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function AddGoalIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" />
    </svg>
  )
}