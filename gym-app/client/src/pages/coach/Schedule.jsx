import { useEffect, useState } from 'react'
import { getCoachSchedule, createSession, getAllAthletes } from '../../api/axios'
import api from '../../api/axios'

const Schedule = () => {
  const [sessions, setSessions] = useState([])
  const [athletes, setAthletes] = useState([])
  const [sports, setSports] = useState([])

  const [form, setForm] = useState({
    athleteId: '',
    sportId: '',
    dateTime: '',
    duration: '',
    location: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchSessions = async () => {
    try {
      const res = await getCoachSchedule()
      setSessions(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [athletesRes, sportsRes] = await Promise.all([
          getAllAthletes(),    // <-- now fetches ALL athletes
          api.get('/sports'),
        ])
        setAthletes(athletesRes.data)
        setSports(sportsRes.data)
      } catch (err) { console.error(err) }
    }
    loadData()
    fetchSessions()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.athleteId || !form.sportId || !form.dateTime) {
      alert('Please fill athlete, sport, and date/time.')
      return
    }
    setSubmitting(true)
    try {
      await createSession({
        athleteId: parseInt(form.athleteId),
        sportId: parseInt(form.sportId),
        dateTime: new Date(form.dateTime).toISOString(),
        duration: parseInt(form.duration) || 60,
        location: form.location,
        notes: form.notes,
      })
      setForm({
        athleteId: '',
        sportId: '',
        dateTime: '',
        duration: '',
        location: '',
        notes: '',
      })
      fetchSessions()
    } catch (err) {
      alert('Failed to create session: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Schedule</h1>

      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">New Session</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Athlete</label>
            <select
              name="athleteId"
              value={form.athleteId}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            >
              <option value="" className="bg-gray-900">-- Select Athlete --</option>
              {athletes.map((profile) => (
                <option key={profile.id} value={profile.id} className="bg-gray-900">
                  {profile.user.firstName} {profile.user.lastName} ({profile.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Sport</label>
            <select
              name="sportId"
              value={form.sportId}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            >
              <option value="" className="bg-gray-900">-- Select Sport --</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id} className="bg-gray-900">
                  {sport.name} {sport.cost !== undefined ? `( $${sport.cost} )` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={form.dateTime}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              placeholder="60"
              value={form.duration}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Gym room or court"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Notes</label>
            <input
              type="text"
              name="notes"
              placeholder="Special instructions"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Athlete</th>
              <th className="py-3 px-4">Sport</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Location</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">No sessions yet</td>
              </tr>
            )}
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4 font-medium">
                  {s.athlete.user?.firstName || s.athlete?.firstName || 'Unknown'} {s.athlete.user?.lastName || s.athlete?.lastName || ''}
                </td>
                <td className="py-3 px-4 text-gray-300">{s.sport.name}</td>
                <td className="py-3 px-4 text-gray-300">{new Date(s.dateTime).toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-300">{s.duration} min</td>
                <td className="py-3 px-4 text-gray-300">{s.location || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule