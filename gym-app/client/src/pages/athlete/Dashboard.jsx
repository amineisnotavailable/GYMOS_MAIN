import { useEffect, useState } from 'react'
import { getAthleteProfile, getAthleteSessions } from '../../api/axios'
import { useAuth } from '../../context/AuthProvider'

const Dashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (user) {
      getAthleteProfile().then(res => {
        setProfile(res.data)
        setSessionCount(res.data.sessions?.length || 0)
        const activeSub = res.data.subscriptions?.find(s => !s.endDate)
        setSubscription(activeSub || null)
      }).catch(console.error)
    }
  }, [user])

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        Welcome, {profile?.user?.firstName || 'Athlete'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-xl font-bold">{profile?.level || '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Scheduled Sessions</p>
          <p className="text-xl font-bold">{sessionCount}</p>
        </div>
        {subscription && (
          <div className="glass p-6 rounded-2xl col-span-1">
            <p className="text-gray-400 text-sm">Active Plan</p>
            <p className="text-lg font-bold text-green-400">{subscription.plan.name}</p>
            <p className="text-xs text-gray-300">
              Remaining Sessions: {subscription.remainingSessions}
            </p>
          </div>
        )}
        {!subscription && (
          <div className="glass p-6 rounded-2xl col-span-1">
            <p className="text-gray-400 text-sm">Subscription</p>
            <p className="text-sm">No active plan. Visit the Shop to subscribe.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard