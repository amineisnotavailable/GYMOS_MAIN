import { useEffect, useState } from 'react'
import api from '../../api/axios'

const Employers = () => {
  const [employers, setEmployers] = useState([])
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' })
  const [msg, setMsg] = useState('')

  const fetchEmployers = async () => {
    const res = await api.get('/admin/users')  // we'll filter by role EMPLOYER
    setEmployers(res.data.filter(u => u.role === 'EMPLOYER'))
  }

  useEffect(() => { fetchEmployers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/employers', form)
      setMsg('Employer created')
      setForm({ email: '', password: '', firstName: '', lastName: '', phone: '' })
      fetchEmployers()
    } catch (err) { setMsg(err.response?.data?.error) }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Employers</h1>
      {msg && <p className="mb-4 text-sm">{msg}</p>}
      <div className="glass p-6 rounded-2xl mb-8 max-w-lg">
        <h2 className="text-xl mb-4">Add Employer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <button type="submit" className="w-full py-3 bg-red-600 rounded-xl font-semibold">Create Employer</button>
        </form>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {employers.map(emp => (
              <tr key={emp.id} className="border-b border-gray-800">
                <td className="py-3 px-4">{emp.firstName} {emp.lastName}</td>
                <td className="py-3 px-4 text-gray-300">{emp.email}</td>
                <td className="py-3 px-4">{emp.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Employers