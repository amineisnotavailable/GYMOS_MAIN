import { useEffect, useState } from 'react'
import { getAthleteNotifications, markAthleteNotificationRead } from '../../api/axios'

const Notifications = () => {
  const [notifs, setNotifs] = useState([])

  const fetch = async () => {
    try {
      const res = await getAthleteNotifications()
      setNotifs(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetch() }, [])

  const markRead = async (id) => {
    try {
      await markAthleteNotificationRead(id)
      fetch()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Notifications</h1>

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