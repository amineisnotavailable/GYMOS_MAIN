import { useAuth } from '../../context/AuthProvider'
import { useEffect, useState } from 'react'
import { getCoachAthletes, getCoachSchedule } from '../../api/axios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [athleteCount, setAthleteCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    if (user?.isApproved) {
      const fetch = async () => {
        try {
          const [athletesRes, sessionsRes] = await Promise.all([
            getCoachAthletes(),
            getCoachSchedule(),
          ])
          setAthleteCount(athletesRes.data.length)
          setSessionCount(sessionsRes.data.length)
        } catch (err) { console.error(err) }
      }
      fetch()
    }
  }, [user])

  if (!user?.isApproved) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="glass p-10 rounded-3xl max-w-md">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Pending Approval</h1>
          <p className="text-gray-300 mb-6">
            Your coach account has been created but needs to be approved by an administrator.
            Once approved, please log out and log in again to gain full access.
          </p>
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-semibold transition"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Coach Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">My Athletes</p>
          <p className="text-3xl font-bold">{athleteCount}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Sessions Scheduled</p>
          <p className="text-3xl font-bold">{sessionCount}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard