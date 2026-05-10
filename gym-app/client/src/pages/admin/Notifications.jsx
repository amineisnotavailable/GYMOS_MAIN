import { useState, useEffect } from 'react'
import {
  pushNotification,
  getUsers,
  getPendingCoaches,
  approveCoach,
} from '../../api/axios'
import api from '../../api/axios'

const AdminNotifications = () => {
  const [userIds, setUserIds] = useState('all')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('GENERAL')
  const [users, setUsers] = useState([])
  const [pendingCoaches, setPendingCoaches] = useState([])
  const [notifications, setNotifications] = useState([])
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    getUsers().then(res => setUsers(res.data)).catch(console.error)
    fetchPendingCoaches()
    fetchNotifications()
  }, [])

  const fetchPendingCoaches = async () => {
    try {
      const res = await getPendingCoaches()
      setPendingCoaches(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications')
      setNotifications(res.data)
    } catch (err) { console.error(err) }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const recipients = userIds === 'all' ? 'all' : [parseInt(userIds)]
    try {
      await pushNotification({ userIds: recipients, message, type })
      setStatusMsg('Notification sent')
      setMessage('')
    } catch (err) {
      setStatusMsg('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleApprove = async (coachProfileId) => {
    try {
      await approveCoach(coachProfileId)
      setStatusMsg('Coach approved!')
      fetchPendingCoaches()
    } catch (err) {
      setStatusMsg('Approval failed: ' + (err.response?.data?.error || err.message))
    }
  }

  const markRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`)
      fetchNotifications()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Notifications</h1>

      {/* Pending Coach Approvals */}
      {pendingCoaches.length > 0 && (
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Pending Coach Approvals</h2>
          {pendingCoaches.map((coach) => (
            <div key={coach.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
              <div>
                <p className="text-white font-medium">{coach.user.firstName} {coach.user.lastName}</p>
                <p className="text-sm text-gray-400">{coach.user.email} — {coach.specialty || 'No specialty'}</p>
              </div>
              <button
                onClick={() => handleApprove(coach.id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {statusMsg && <p className="text-sm text-gray-300">{statusMsg}</p>}

      {/* Send notification */}
      <div className="glass p-8 rounded-2xl max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Send General Notification</h2>
        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Recipient</label>
            <select value={userIds} onChange={e => setUserIds(e.target.value)} className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white">
              <option value="all" className="bg-gray-900">All Users</option>
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-gray-900">{u.firstName} {u.lastName} ({u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white">
              <option value="GENERAL" className="bg-gray-900">General</option>
              <option value="REMINDER" className="bg-gray-900">Reminder</option>
              <option value="ABSENCE" className="bg-gray-900">Absence</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          </div>
          <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold">Send Push Notification</button>
        </form>
      </div>

      {/* Inbox */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
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

export default AdminNotifications