export default function StatusBarMock() {
    return (
      <div className="flex items-center justify-between px-4 pt-3 pb-1 text-gray-900 sm:px-6">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>
    )
  }
  
  function SignalIcon() {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
        <rect x="0" y="7" width="3" height="5" rx="0.5" />
        <rect x="5" y="5" width="3" height="7" rx="0.5" />
        <rect x="10" y="3" width="3" height="9" rx="0.5" />
        <rect x="15" y="0" width="3" height="12" rx="0.5" />
      </svg>
    )
  }
  
  function WifiIcon() {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M1 4.5a10 10 0 0 1 14 0" />
        <path d="M3.5 7.2a6.3 6.3 0 0 1 9 0" />
        <path d="M6.2 9.8a2.6 2.6 0 0 1 3.6 0" />
      </svg>
    )
  }
  
  function BatteryIcon() {
    return (
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" />
        <rect x="2" y="2" width="17" height="8" rx="1.2" fill="currentColor" />
        <rect x="21.5" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" />
      </svg>
    )
  }