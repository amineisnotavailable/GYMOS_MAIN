import { useEffect, useState } from 'react'
import { getReports } from '../../api/axios'

const Reports = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    getReports().then(res => setData(res.data)).catch(console.error)
  }, [])

  if (!data) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Reports</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">User Distribution</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Admins</span>
              <span className="font-bold">{data.admins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coaches</span>
              <span className="font-bold">{data.coaches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Athletes</span>
              <span className="font-bold">{data.athletes}</span>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Total Users</h2>
          <p className="text-5xl font-bold text-red-400">{data.totalUsers}</p>
        </div>
      </div>
    </div>
  )
}

export default Reports