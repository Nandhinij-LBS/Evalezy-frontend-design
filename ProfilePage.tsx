import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignOut = async () => {
    setLoading(true)
    setError('')
    try {
      await logout()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col pb-8">
      <header className="px-4 pt-6 pb-4 sm:px-5">
        <h1 className="font-semibold text-gray-900 text-lg">Profile</h1>
      </header>

      <div className="px-4 sm:px-5">
        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-brand text-white flex items-center justify-center font-semibold">
            {user?.name.charAt(0) ?? 'E'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name ?? 'Employee'}</p>
            <p className="text-sm text-gray-500">{user?.role ?? 'Employee'}</p>
            <p className="text-xs text-gray-400">{user?.email ?? ''}</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full min-h-11 mt-6 border border-gray-300 text-gray-600 rounded-lg py-2.5 font-medium text-sm disabled:opacity-60"
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}