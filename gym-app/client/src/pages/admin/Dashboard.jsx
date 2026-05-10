import { useEffect, useState } from 'react'
import { getReports, getGymRevenue } from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [reportsRes, revenueRes] = await Promise.all([getReports(), getGymRevenue()])
        setStats(reportsRes.data)
        setRevenue(revenueRes.data)
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white">{stats?.totalUsers ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Coaches</p>
          <p className="text-3xl font-bold text-white">{stats?.coaches ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Athletes</p>
          <p className="text-3xl font-bold text-white">{stats?.athletes ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Gym Revenue</p>
          <p className="text-3xl font-bold text-green-400">
            ${revenue?.totalRevenue?.toFixed(2) ?? '0.00'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard