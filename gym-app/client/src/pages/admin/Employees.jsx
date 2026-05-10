import { useEffect, useState } from 'react'
import { getEmployees, createEmployee, fireEmployee } from '../../api/axios'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    name: '',
    position: 'RECEPTION',
    salary: '',
    schedule: '',
    email: '',
    password: '',
  })

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees()
      setEmployees(res.data)
    } catch (err) {
      console.error('Failed to load employees', err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createEmployee({
        ...form,
        salary: parseFloat(form.salary),
      })
      // Clear form
      setForm({
        name: '',
        position: 'RECEPTION',
        salary: '',
        schedule: '',
        email: '',
        password: '',
      })
      fetchEmployees() // refresh list
    } catch (err) {
      alert('Failed to hire employee: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleFire = async (id) => {
    try {
      await fireEmployee(id)
      fetchEmployees()
    } catch (err) {
      alert('Failed to fire employee: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Employees</h1>

      {/* Add employee form */}
      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Add Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500"
          />
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
          >
            <option value="RECEPTION" className="bg-gray-900">Reception</option>
            <option value="CASHIER" className="bg-gray-900">Cashier</option>
          </select>
          <input
            name="salary"
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500"
          />
          <input
            name="schedule"
            placeholder="Schedule (e.g., Mon-Fri 9am-5pm)"
            value={form.schedule}
            onChange={handleChange}
            className="p-3 rounded-xl bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500"
          />

          <button
            type="submit"
            className="py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors"
          >
            Hire
          </button>
        </form>
      </div>

      {/* Employee list */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4 font-medium">{emp.name}</td>
                <td className="py-3 px-4 text-gray-300">{emp.position}</td>
                <td className="py-3 px-4 text-gray-300">${emp.salary}</td>
                <td className="py-3 px-4">
                  {emp.firedAt ? (
                    <span className="text-red-400">Fired</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {!emp.firedAt && (
                    <button
                      onClick={() => handleFire(emp.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Fire
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employees