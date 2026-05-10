import { useEffect, useState } from 'react'
import { getGymRevenue } from '../../api/axios'

const Dashboard = () => {
  const [revenue, setRevenue] = useState(null)
  useEffect(() => { getGymRevenue().then(res => setRevenue(res.data)).catch(console.error) }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Employer Dashboard</h1>
      <div className="glass p-6 rounded-2xl max-w-md">
        <p className="text-gray-400 text-sm">Gym Revenue</p>
        <p className="text-3xl font-bold text-green-400">${revenue?.totalRevenue?.toFixed(2) ?? '0.00'}</p>
      </div>
    </div>
  )
}
export default Dashboard