import { useEffect, useState } from 'react'
import { getReports, getGymRevenue } from '../../api/axios'
import api from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState(null)

  useEffect(() => {
    getReports().then(r => setStats(r.data)).catch(console.error)
    api.get('/owner/revenue').then(r => setRevenue(r.data)).catch(console.error)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold">{stats?.totalUsers ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Coaches</p>
          <p className="text-3xl font-bold">{stats?.coaches ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Athletes</p>
          <p className="text-3xl font-bold">{stats?.athletes ?? '...'}</p>
        </div>
        <div className="glass p-6 rounded-2xl">
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