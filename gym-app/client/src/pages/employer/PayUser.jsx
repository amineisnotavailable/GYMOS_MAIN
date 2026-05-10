import { useEffect, useState } from 'react'
import api from '../../api/axios'

const PayUser = () => {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/employer/users')
      .then(r => {
        // Filter out ATHLETE users
        const allowed = r.data.filter(u => u.role === 'EMPLOYEE' || u.role === 'COACH' || u.role === 'ADMIN')
        setUsers(allowed)
      })
      .catch(console.error)
  }, [])

  const pay = async (e) => {
    e.preventDefault()
    if (!userId || amount <= 0) return
    try {
      await api.post('/employer/pay-user', {
        userId: parseInt(userId),
        amount: parseFloat(amount)
      })
      setMsg('Payment sent!')
      setAmount('')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Payment failed')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Pay User</h1>
      <div className="glass p-6 rounded-2xl max-w-lg">
        {msg && <p className="mb-4 text-sm text-gray-300">{msg}</p>}
        <form onSubmit={pay} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">User (Employees, Coaches, Admins)</label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white"
            >
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-gray-900">
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold"
          >
            Send Payment
          </button>
        </form>
      </div>
    </div>
  )
}

export default PayUser