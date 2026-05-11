import { useEffect, useState } from 'react'
import api from '../../api/axios'

const Sales = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/shop/sales').then(r => setOrders(r.data)).catch(console.error)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Sales History</h1>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4">#{order.id}</td>
                <td className="py-3 px-4">{order.user.firstName} {order.user.lastName}</td>
                <td className="py-3 px-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {item.product?.name || item.plan?.name} x{item.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4 text-green-400">${order.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales