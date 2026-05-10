import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import '../styles/abstract-bg.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="h-screen flex items-center justify-center abstract-container">
      <div className="glass p-10 rounded-3xl w-full max-w-md mx-4 animate-fade-in">
        <h1 className="text-4xl font-bold text-red-500 mb-1 text-center">Welcome back</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20 uppercase tracking-wider"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-red-400 hover:text-red-300 hover:underline transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login