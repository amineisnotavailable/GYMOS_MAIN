import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'
import '../styles/abstract-bg.css'

// Password strength calculator
const getStrength = (password) => {
  let score = 0
  if (!password) return { label: '', color: '', score: 0 }

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', color: '#ef4444', score }
  if (score <= 4) return { label: 'Medium', color: '#f97316', score }
  return { label: 'Strong', color: '#22c55e', score }
}

// Calculate age and maturity from date of birth
const getMaturity = (dob) => {
  if (!dob) return { maturity: 'ADULT', isMinor: false }
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return {
    maturity: age < 18 ? 'MINOR' : 'ADULT',
    isMinor: age < 18
  }
}

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'ATHLETE',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    parentContact: '',
    level: 'AMATEUR',
    specialty: '',
    cardId: '',         // ← mock card ID
  })
  const [sports, setSports] = useState(null)          // all sports from DB
  const [selectedSports, setSelectedSports] = useState([])
  const [mockCards, setMockCards] = useState([])     // ← mock cards
  const { register } = useAuth()
  const navigate = useNavigate()

  const strength = getStrength(form.password)
  const { maturity, isMinor } = getMaturity(form.dateOfBirth)
  const canCompete = form.level === 'INTERMEDIATE' || form.level === 'PROFESSIONAL'

  // Fetch sports and mock cards on mount
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get('/api/public/sports')
        setSports(res.data)
      } catch (err) {
        console.error('Sports fetch failed:', err)
        setSports([])
      }
    }
    fetchSports()

    // ← fetch mock cards
    axios.get('/api/public/cards')
      .then(res => setMockCards(res.data))
      .catch(console.error)
  }, [])

  const toggleSport = (sportId) => {
    setSelectedSports(prev =>
      prev.includes(sportId) ? prev.filter(id => id !== sportId) : [...prev, sportId]
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { dateOfBirth, ...rest } = form
    let payload = {
      ...rest,
      maturity,
      parentContact: isMinor ? form.parentContact : null,
    }

    if (form.role === 'ATHLETE') {
      payload.competitionValidity = canCompete
      payload.sportIds = selectedSports
      payload.cardId = form.cardId ? parseInt(form.cardId) : null
    } else if (form.role === 'COACH') {
      payload.specialty = form.specialty || null
    }

    // Remove athlete-specific fields if not athlete
    if (payload.role !== 'ATHLETE') {
      delete payload.maturity
      delete payload.parentContact
      delete payload.level
      delete payload.competitionValidity
      delete payload.sportIds
      delete payload.cardId
    }

    try {
      await register(payload)
      navigate('/')
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center abstract-container overflow-hidden">
      <div className="glass p-6 rounded-3xl w-full max-w-xl mx-4 animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h1 className="text-3xl font-bold text-red-500 mb-1 text-center">Create Account</h1>
        <p className="text-gray-400 text-center mb-4">Join the gym system</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">First Name</label>
              <input name="firstName" onChange={handleChange} required className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Last Name</label>
              <input name="lastName" onChange={handleChange} required className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input name="email" type="email" onChange={handleChange} required className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
            {form.password.length > 0 && (
              <div className="mt-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-gray-400">Strength</span>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((strength.score + 1) / 7) * 100}%`,
                      backgroundColor: strength.color
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <input name="phone" onChange={handleChange} className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm">
                <option value="ATHLETE" className="bg-gray-900">Athlete</option>
                <option value="COACH" className="bg-gray-900">Coach</option>
              </select>
            </div>
          </div>

          {/* Athlete fields */}
          {form.role === 'ATHLETE' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
                  {form.dateOfBirth && (
                    <p className="text-xs mt-1" style={{ color: isMinor ? '#ef4444' : '#22c55e' }}>
                      {isMinor ? 'Minor (under 18)' : 'Adult'}
                    </p>
                  )}
                </div>
                {isMinor && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Parent Email</label>
                    <input name="parentContact" onChange={handleChange} required className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Level</label>
                <div className="flex items-center gap-3">
                  <select name="level" value={form.level} onChange={handleChange} className="flex-1 p-2.5 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm">
                    <option value="AMATEUR" className="bg-gray-900">Amateur</option>
                    <option value="INTERMEDIATE" className="bg-gray-900">Intermediate</option>
                    <option value="PROFESSIONAL" className="bg-gray-900">Professional</option>
                  </select>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      canCompete
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-gray-700/30 text-gray-400'
                    }`}
                  >
                    {canCompete ? 'Competition Eligible' : 'No Competitions'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only Intermediate & Professional athletes can participate in competitions.
                </p>
              </div>

              {/* Sports selection */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Select Sports</label>
                {sports === null ? (
                  <p className="text-xs text-gray-500">Loading sports...</p>
                ) : sports.length === 0 ? (
                  <div>
                    <p className="text-xs text-red-400 mb-1">Could not load sports from server.</p>
                    <p className="text-xs text-gray-500">
                      Make sure the backend is running and the route <code>/api/public/sports</code> is registered.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sports.map((sport) => (
                      <button
                        type="button"
                        key={sport.id}
                        onClick={() => toggleSport(sport.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedSports.includes(sport.id)
                            ? 'bg-red-600/30 border-red-500 text-red-300'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-red-500/50'
                        }`}
                      >
                        {sport.name}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  You can select multiple sports.
                </p>
              </div>

              {/* ← Mock Card selection */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Payment Card</label>
                <select
                  name="cardId"
                  value={form.cardId}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                >
                  <option value="">-- Select a card --</option>
                  {mockCards.map(card => (
                    <option key={card.id} value={card.id} className="bg-gray-900">
                      {card.holderName} (****{card.cardNumber.slice(-4)}) - ${card.balance}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">$10 will be deducted from the selected card.</p>
              </div>
            </>
          )}

          {/* Coach specialty */}
          {form.role === 'COACH' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Specialty (Sport)</label>
              <select
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
              >
                <option value="" className="bg-gray-900">-- Select Specialty --</option>
                {sports && sports.map((sport) => (
                  <option key={sport.id} value={sport.name} className="bg-gray-900">
                    {sport.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Your coaching specialty (optional).</p>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20 uppercase tracking-wider text-sm mt-1">
            Register
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:text-red-300 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register