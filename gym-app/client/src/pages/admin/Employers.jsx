import { useState } from 'react'
import api from '../../api/axios'

const Employers = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/admin/employers', form)
      setMessage(`Employer account created for ${res.data.user.email}`)
      setError('')
      setForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employer')
      setMessage('')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Add Employer</h1>

      <div className="glass p-8 rounded-2xl max-w-lg">
        {message && <p className="mb-4 text-green-400">{message}</p>}
        {error && <p className="mb-4 text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20"
          >
            Create Employer Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Employers