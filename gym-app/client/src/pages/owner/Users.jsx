import { useEffect, useState } from 'react'
import { getUsers } from '../../api/axios'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => { getUsers().then(r => setUsers(r.data)) }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">All Users</h1>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4">{u.firstName} {u.lastName}</td>
                <td className="py-3 px-4 text-gray-300">{u.email}</td>
                <td className="py-3 px-4">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Users