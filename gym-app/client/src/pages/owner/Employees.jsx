import { useEffect, useState } from 'react'
import api from '../../api/axios'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    name: '', position: 'RECEPTION', salary: '', schedule: '', email: '', password: ''
  })
  const [status, setStatus] = useState('')

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/admin/employees')
      setEmployees(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchEmployees() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/employees', {
        ...form,
        salary: parseFloat(form.salary)
      })
      setForm({ name: '', position: 'RECEPTION', salary: '', schedule: '', email: '', password: '' })
      setStatus('Employee hired!')
      fetchEmployees()
    } catch (err) {
      setStatus(err.response?.data?.error || 'Hire failed')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Employees</h1>
      {status && <p className="mb-4 text-sm text-gray-300">{status}</p>}

      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="p-3 rounded-xl bg-transparent border border-white/10 text-white">
            <option value="RECEPTION" className="bg-gray-900">Reception</option>
            <option value="CASHIER" className="bg-gray-900">Cashier</option>
          </select>
          <input type="number" placeholder="Salary" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required className="p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <input placeholder="Schedule (e.g. Mon-Fri 9-5)" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} className="p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <button type="submit" className="py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold">Hire</button>
        </form>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4">{emp.name}</td>
                <td className="py-3 px-4 text-gray-300">{emp.position}</td>
                <td className="py-3 px-4 text-gray-300">${emp.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employees