import { useState, useEffect } from 'react'
import { getPendingCoaches, approveCoach, rejectCoach } from '../../api/axios'

const Requests = () => {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchPending = async () => {
    try {
      const res = await getPendingCoaches()
      setPending(res.data)
    } catch (err) {
      console.error(err)
      setStatusMsg('Failed to load pending requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (coachProfileId) => {
    try {
      await approveCoach(coachProfileId)
      setStatusMsg('Coach approved!')
      setPending(prev => prev.filter(c => c.id !== coachProfileId))
    } catch (err) {
      setStatusMsg('Approval failed: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleReject = async (coachProfileId) => {
    if (!window.confirm('Are you sure you want to reject and delete this coach account?')) return
    try {
      await rejectCoach(coachProfileId)
      setStatusMsg('Coach rejected and deleted.')
      setPending(prev => prev.filter(c => c.id !== coachProfileId))
    } catch (err) {
      setStatusMsg('Rejection failed: ' + (err.response?.data?.error || err.message))
    }
  }

  if (loading) return <p className="text-gray-400">Loading requests...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Pending Coach Requests</h1>

      {statusMsg && <p className="mb-4 text-sm text-gray-300">{statusMsg}</p>}

      {pending.length === 0 ? (
        <div className="glass p-8 rounded-2xl text-center text-gray-400">
          No pending coach requests.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-red-800/50">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((coach) => (
                <tr key={coach.id} className="border-b border-gray-800 hover:bg-red-900/10">
                  <td className="py-3 px-4 font-medium">
                    {coach.user.firstName} {coach.user.lastName}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{coach.user.email}</td>
                  <td className="py-3 px-4 text-gray-300">{coach.specialty || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-600/20 text-yellow-400">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(coach.id)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(coach.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Requests