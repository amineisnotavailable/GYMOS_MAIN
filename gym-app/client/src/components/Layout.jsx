import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthProvider'
import { getAthleteProfile } from '../api/axios'
import WalletBalance from './WalletBalance'

const Layout = ({ role }) => {
  const { user } = useAuth()
  const [athleteInfo, setAthleteInfo] = useState(null)

  // Fetch athlete details if the role is ATHLETE
  useEffect(() => {
    let cancelled = false
    if (role === 'ATHLETE' && user) {
      getAthleteProfile()
        .then((res) => {
          if (!cancelled) setAthleteInfo(res.data)
        })
        .catch(console.error)
    }
    return () => { cancelled = true }
  }, [role, user])

  // Determine what to show in the profile bar
  const profileDisplay = {
    name: user ? `${user.firstName} ${user.lastName}` : 'User',
    role: role,
  }
  if (role === 'ATHLETE' && athleteInfo) {
    profileDisplay.level = athleteInfo.level
    profileDisplay.sports = athleteInfo.sports?.map((s) => s.sport.name).join(', ') || 'No sports'
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar role={role} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-black/80 backdrop-blur-md border-b border-red-800 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-300">
            {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
          </h2>

          <div className="flex items-center gap-4">
            {/* Wallet balance */}
            <WalletBalance />

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {profileDisplay.name}
              </p>
              <p className="text-xs text-red-400">
                {profileDisplay.role}
                {profileDisplay.level && ` · ${profileDisplay.level}`}
              </p>
              {profileDisplay.sports && (
                <p className="text-xs text-gray-400">{profileDisplay.sports}</p>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center text-sm font-bold text-red-400">
              {profileDisplay.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout