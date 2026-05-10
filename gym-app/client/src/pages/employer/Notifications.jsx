import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Notifications = () => {
  const [users, setUsers] = useState([])
  const [notifs, setNotifs] = useState([])
  const [recipientId, setRecipientId] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.get('/employer/users').then(r=>setUsers(r.data))
    api.get('/employer/notifications').then(r=>setNotifs(r.data))
  }, [])

  const send = async (e) => {
    e.preventDefault()
    try { await api.post('/employer/notifications', { recipientId: parseInt(recipientId), message }); setStatus('Sent'); setMessage('') }
    catch(e) { setStatus(e.response?.data?.error) }
  }

  const markRead = async (id) => {
    await api.put(`/employer/notifications/${id}/read`)
    setNotifs(prev=>prev.map(n=>n.id===id?{...n,isRead:true}:n))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-red-500">Notifications</h1>
      <div className="glass p-6 rounded-2xl max-w-lg">
        <h2 className="text-xl mb-4">Send</h2>
        {status && <p className="mb-2 text-sm">{status}</p>}
        <form onSubmit={send} className="space-y-4">
          <select value={recipientId} onChange={e=>setRecipientId(e.target.value)} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white">
            <option value="">-- Select --</option>
            {users.map(u=><option key={u.id} value={u.id} className="bg-gray-900">{u.firstName} {u.lastName} ({u.role})</option>)}
          </select>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <button type="submit" className="w-full py-3 bg-red-600 rounded-xl font-semibold">Send</button>
        </form>
      </div>
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl mb-4">Inbox</h2>
        {notifs.map(n=><div key={n.id} className={`p-4 rounded-xl flex justify-between ${n.isRead?'opacity-50':'bg-white/5'}`}><div><p className="text-white">{n.message}</p><p className="text-xs text-gray-400">{n.type} · {new Date(n.createdAt).toLocaleString()}{n.sender?<span className="text-red-400"> · {n.sender.firstName} {n.sender.lastName}</span>:''}</p></div>{!n.isRead&&<button onClick={()=>markRead(n.id)} className="text-sm text-red-400">Mark read</button>}</div>)}
      </div>
    </div>
  )
}
export default Notifications