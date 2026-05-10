import { useEffect, useState } from 'react'
import api from '../../api/axios'

const Requests = () => {
  const [pending, setPending] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/admin/pending-coaches').then(r => setPending(r.data))
  }, [])

  const approve = async (id) => {
    try {
      await api.put(`/admin/approve-coach/${id}`)
      setPending(p => p.filter(c => c.id !== id))
      setMsg('Approved')
    } catch (e) { setMsg(e.response?.data?.error) }
  }

  const reject = async (id) => {
    try {
      await api.delete(`/admin/reject-coach/${id}`)
      setPending(p => p.filter(c => c.id !== id))
      setMsg('Rejected')
    } catch (e) { setMsg(e.response?.data?.error) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Pending Coach Requests</h1>
      {msg && <p className="mb-4 text-sm">{msg}</p>}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Specialty</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(c => (
              <tr key={c.id} className="border-b border-gray-800">
                <td className="py-3 px-4">{c.user.firstName} {c.user.lastName}</td>
                <td className="py-3 px-4 text-gray-300">{c.user.email}</td>
                <td className="py-3 px-4">{c.specialty || '—'}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => approve(c.id)} className="px-3 py-1 bg-green-600 rounded text-sm">Approve</button>
                  <button onClick={() => reject(c.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Requests