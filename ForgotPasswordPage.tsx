import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeroBanner />

      <div className="bg-white rounded-t-3xl shadow-lg -mt-12 px-4 pt-8 pb-8 relative z-10 flex-1 sm:px-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot Password</h2>

        {sent ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              If an account exists for {email}, a password reset link has been sent.
            </p>
            <Link
              to="/"
              className="block w-full min-h-11 text-center bg-teal-brand text-white rounded-lg py-2 font-medium"
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              Enter your User ID and we'll send you a link to reset your password.
            </p>
            <input
              type="text"
              required
              placeholder="User ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-brand"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 bg-teal-brand text-white rounded-lg py-2 font-medium disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link to="/" className="block text-sm text-center text-indigo-600 font-medium">
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}