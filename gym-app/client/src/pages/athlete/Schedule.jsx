import { useEffect, useState } from 'react'
import { getAthleteSessions } from '../../api/axios'

const Schedule = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAthleteSessions()
        setSessions(res.data)
      } catch (err) {
        // Show the exact error from server, or a fallback
        const msg = err.response?.data?.error || 'Unable to load schedule.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <p className="text-gray-400">Loading schedule...</p>
  if (error) return <p className="text-red-400">Error: {error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">My Schedule</h1>
      {sessions.length === 0 ? (
        <div className="glass p-8 rounded-2xl text-center text-gray-400">
          No sessions scheduled yet.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-red-800/50">
                <th className="py-3 px-4">Sport</th>
                <th className="py-3 px-4">Coach</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-red-900/10">
                  <td className="py-3 px-4">{s.sport.name}</td>
                  <td className="py-3 px-4">
                    {s.coach?.firstName || 'Unknown'} {s.coach?.lastName || ''}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {new Date(s.dateTime).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{s.duration} min</td>
                  <td className="py-3 px-4 text-gray-300">{s.location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Schedule