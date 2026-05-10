import { useEffect, useState } from 'react'
import api from '../../api/axios'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  useEffect(() => { api.get('/admin/employees').then(r => setEmployees(r.data)) }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Employees</h1>
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
            {employees.map(e => (
              <tr key={e.id} className="border-b border-gray-800">
                <td className="py-3 px-4">{e.name}</td>
                <td className="py-3 px-4 text-gray-300">{e.position}</td>
                <td className="py-3 px-4">${e.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Employees