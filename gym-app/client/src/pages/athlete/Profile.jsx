import { useEffect, useState } from 'react'
import { getAthleteProfile } from '../../api/axios'

const Profile = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getAthleteProfile().then(res => setProfile(res.data)).catch(console.error)
  }, [])

  if (!profile) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">My Profile</h1>
      <div className="glass p-8 rounded-2xl max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-semibold">{profile.user.firstName} {profile.user.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-semibold text-gray-300">{profile.user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="font-semibold">{profile.level}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Maturity</p>
            <p className="font-semibold">{profile.maturity}</p>
          </div>
        </div>
        {profile.maturity === 'MINOR' && (
          <div>
            <p className="text-sm text-gray-400">Parent Contact</p>
            <p className="font-semibold">{profile.parentContact}</p>
          </div>
        )}
        {profile.coach && (
          <div>
            <p className="text-sm text-gray-400">Coach</p>
            <p className="font-semibold">{profile.coach.firstName} {profile.coach.lastName}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile