import { useState, useEffect } from 'react'
import { register } from '../../api/axios'
import axios from 'axios'

const AddCoach = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialty: '',
  })
  const [sports, setSports] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch sports for specialty dropdown
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get('/api/public/sports')
        setSports(res.data)
      } catch (err) {
        console.error('Failed to load sports', err)
      }
    }
    fetchSports()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Create user with role COACH and specialty
      await register({
        ...form,
        role: 'COACH',
        specialty: form.specialty,    // send specialty as string (sport name)
      })
      setMessage(`Coach account created for ${form.email}`)
      setError('')
      setForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        specialty: '',
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coach')
      setMessage('')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Add Coach</h1>

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
          <div>
            <label className="block text-sm text-gray-300 mb-1">Specialty (Sport)</label>
            <select
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            >
              <option value="" className="bg-gray-900">-- Select Specialty --</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name} className="bg-gray-900">
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20"
          >
            Create Coach Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCoach