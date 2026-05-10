import { useEffect, useState } from 'react'
import api from '../../api/axios'

const WithdrawalRequests = () => {
  const [reqs, setReqs] = useState([])
  const [status, setStatus] = useState('')
  useEffect(() => { api.get('/employer/withdrawal-requests').then(r=>setReqs(r.data)) }, [])

  const approve = async (id) => {
    try { await api.put(`/employer/withdrawal-requests/${id}/approve`); setStatus('Approved'); setReqs(reqs.filter(r=>r.id!==id)) }
    catch(e) { setStatus(e.response?.data?.error) }
  }
  const reject = async (id) => {
    try { await api.put(`/employer/withdrawal-requests/${id}/reject`); setStatus('Rejected'); setReqs(reqs.filter(r=>r.id!==id)) }
    catch(e) { setStatus(e.response?.data?.error) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Withdrawal Requests</h1>
      {status && <p className="mb-4 text-sm">{status}</p>}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="text-gray-400 border-b border-red-800/50"><th className="py-3 px-4">User</th><th className="py-3 px-4">Amount</th><th className="py-3 px-4">Actions</th></tr></thead>
          <tbody>{reqs.map(r=>(<tr key={r.id} className="border-b border-gray-800 hover:bg-red-900/10"><td className="py-3 px-4">{r.user.firstName} {r.user.lastName}</td><td className="py-3 px-4">${r.amount}</td><td className="py-3 px-4 flex gap-2"><button onClick={()=>approve(r.id)} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm">Approve</button><button onClick={()=>reject(r.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">Reject</button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}
export default WithdrawalRequests