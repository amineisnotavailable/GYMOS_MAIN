import { useEffect, useState } from 'react'
import { getAthleteProfile, getAthleteSessions } from '../../api/axios'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profRes, sessRes] = await Promise.all([getAthleteProfile(), getAthleteSessions()])
        setProfile(profRes.data)
        setSessionCount(sessRes.data.length)
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Welcome, {profile?.user?.firstName || 'Athlete'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-xl font-bold">{profile?.level || '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Scheduled Sessions</p>
          <p className="text-xl font-bold">{sessionCount}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard