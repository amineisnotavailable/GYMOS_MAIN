import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Notifications = () => {
  const [recipientId, setRecipientId] = useState('')
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [notifs, setNotifs] = useState([])
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/employee/users')
        setUsers(res.data)
      } catch (err) { console.error(err) }
    }
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/employee/notifications')
        setNotifs(res.data)
      } catch (err) { console.error(err) }
    }
    fetchUsers()
    fetchNotifs()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!recipientId || !message) return
    try {
      await api.post('/employee/notifications', {
        recipientId: parseInt(recipientId),
        message,
        type: 'GENERAL',
      })
      setStatusMsg('Notification sent')
      setMessage('')
    } catch (err) {
      setStatusMsg('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const markRead = async (id) => {
    try {
      await api.put(`/employee/notifications/${id}/read`)
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Notifications</h1>

      {/* Send notification */}
      <div className="glass p-6 rounded-2xl max-w-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
        {statusMsg && <p className="mb-4 text-sm text-gray-300">{statusMsg}</p>}
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Recipient</label>
            <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" required>
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-gray-900">{u.firstName} {u.lastName} ({u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          </div>
          <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold">Send</button>
        </form>
      </div>

      {/* Inbox */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
        {notifs.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {notifs.map((n) => (
              <div key={n.id} className={`p-4 rounded-xl flex justify-between items-center ${n.isRead ? 'opacity-50' : 'bg-white/5'}`}>
                <div>
                  <p className="text-white font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400">
                    {n.type} · {new Date(n.createdAt).toLocaleString()}
                    {n.sender ? (
                      <span className="text-red-400"> · From: {n.sender.firstName} {n.sender.lastName}</span>
                    ) : (
                      <span className="text-gray-500"> · System</span>
                    )}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications