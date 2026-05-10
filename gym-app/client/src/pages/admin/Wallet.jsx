import { useEffect, useState } from 'react'
import { getMyWallet } from '../../api/axios'
import api from '../../api/axios'

const Wallet = () => {
  const [balance, setBalance] = useState(null)
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')
  const [requests, setRequests] = useState([])

  useEffect(() => {
    getMyWallet().then(r => setBalance(r.data.balance))
    api.get('/wallet/withdrawals').then(r => setRequests(r.data))
  }, [])

  const withdraw = async (e) => {
    e.preventDefault()
    try {
      await api.post('/wallet/withdraw', { amount: parseFloat(amount) })
      setMsg('Request submitted')
      setAmount('')
      getMyWallet().then(r => setBalance(r.data.balance))
      api.get('/wallet/withdrawals').then(r => setRequests(r.data))
    } catch (err) { setMsg(err.response?.data?.error) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Wallet</h1>
      <div className="glass p-6 rounded-2xl mb-6 max-w-lg">
        <p className="text-gray-400 text-sm">Balance</p>
        <p className="text-3xl font-bold text-green-400">${balance?.toFixed(2) ?? '...'}</p>
      </div>
      <div className="glass p-6 rounded-2xl max-w-lg mb-6">
        <h2 className="text-xl mb-4">Request Withdrawal</h2>
        {msg && <p className="mb-2 text-sm">{msg}</p>}
        <form onSubmit={withdraw} className="space-y-4">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <button type="submit" className="w-full py-2 bg-red-600 rounded-xl font-semibold">Request</button>
        </form>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <h2 className="p-4 text-lg font-semibold">My Requests</h2>
        <table className="w-full text-left">
          <thead><tr className="text-gray-400 border-b border-red-800/50"><th className="py-3 px-4">Amount</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Date</th></tr></thead>
          <tbody>{requests.map(r => (<tr key={r.id} className="border-b border-gray-800"><td className="py-3 px-4">${r.amount}</td><td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='PENDING'?'bg-yellow-600/20 text-yellow-400':r.status==='APPROVED'?'bg-green-600/20 text-green-400':'bg-red-600/20 text-red-400'}`}>{r.status}</span></td><td className="py-3 px-4 text-gray-500 text-sm">{new Date(r.createdAt).toLocaleString()}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}
export default Wallet