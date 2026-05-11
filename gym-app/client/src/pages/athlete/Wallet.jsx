import { useEffect, useState } from 'react'
import { getMyWallet } from '../../api/axios'
import api from '../../api/axios'

const Wallet = () => {
  const [balance, setBalance] = useState(null)
  const [cards, setCards] = useState([])        // mock cards for top-up
  const [cardId, setCardId] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')
  const [requests, setRequests] = useState([])

  useEffect(() => {
    getMyWallet().then(r => setBalance(r.data.balance)).catch(console.error)
    api.get('/public/cards').then(r => setCards(r.data)).catch(console.error)   // need public cards endpoint; we'll add it
    api.get('/wallet/withdrawals').then(r => setRequests(r.data)).catch(console.error)
  }, [])

  // Top-up from a mock card
  const topUp = async (e) => {
    e.preventDefault()
    if (!cardId || amount <= 0) return
    try {
      await api.post('/wallet/pay', {
        cardId: parseInt(cardId),
        amount: parseFloat(amount)
      })
      setMsg('Top-up successful!')
      setAmount('')
      setCardId('')
      const res = await getMyWallet()
      setBalance(res.data.balance)
    } catch (err) {
      setMsg(err.response?.data?.error || 'Top-up failed')
    }
  }

  // Request withdrawal
  const withdraw = async (e) => {
    e.preventDefault()
    if (amount <= 0) return
    try {
      await api.post('/wallet/withdraw', { amount: parseFloat(amount) })
      setMsg('Withdrawal request submitted')
      setAmount('')
      getMyWallet().then(r => setBalance(r.data.balance))
      api.get('/wallet/withdrawals').then(r => setRequests(r.data))
    } catch (err) { setMsg(err.response?.data?.error || 'Withdrawal failed') }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Wallet</h1>

      {/* Balance display */}
      <div className="glass p-6 rounded-2xl mb-6 max-w-lg">
        <p className="text-sm text-gray-400">Current Balance</p>
        <p className="text-3xl font-bold text-green-400">
          ${balance !== null ? balance.toFixed(2) : '...'}
        </p>
      </div>

      {/* Top-Up Form */}
      <div className="glass p-6 rounded-2xl max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Top‑Up from Card</h2>
        {msg && <p className="mb-2 text-sm text-gray-300">{msg}</p>}
        <form onSubmit={topUp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Select Mock Card</label>
            <select
              value={cardId}
              onChange={e => setCardId(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white"
            >
              <option value="">-- Choose a card --</option>
              {cards.map(card => (
                <option key={card.id} value={card.id} className="bg-gray-900">
                  {card.holderName} (****{card.cardNumber.slice(-4)}) – ${card.balance.toFixed(2)}
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
            className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-xl font-semibold"
          >
            Top‑Up Now
          </button>
        </form>
      </div>

      {/* Withdrawal Request Form */}
      <div className="glass p-6 rounded-2xl max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
        <form onSubmit={withdraw} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white"
          />
          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-xl font-semibold"
          >
            Request Withdrawal
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="glass rounded-2xl overflow-hidden">
        <h2 className="p-4 text-lg font-semibold">My Requests</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4">${r.amount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    r.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                    r.status === 'APPROVED' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-sm">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Wallet