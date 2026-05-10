import { useEffect, useState } from 'react'
import { getUsers } from '../../api/axios'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUsers()
        setUsers(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">All Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4 font-medium">{user.firstName} {user.lastName}</td>
                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN' ? 'bg-red-600/20 text-red-400' : 
                    user.role === 'COACH' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                  }`}>{user.role}</span>
                </td>
                <td className="py-3 px-4 text-gray-300">{user.phone || '—'}</td>
                <td className="py-3 px-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users