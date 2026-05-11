import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { getMyWallet } from '../../api/axios'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [plans, setPlans] = useState([])
  const [balance, setBalance] = useState(null)
  const [mode, setMode] = useState('products') // 'products' or 'subscriptions'
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    api.get('/shop/products').then(r => setProducts(r.data)).catch(console.error)
    api.get('/shop/plans').then(r => setPlans(r.data)).catch(console.error)
    getMyWallet().then(r => setBalance(r.data.balance)).catch(console.error)
  }, [])

  const buyProduct = async (productId, quantity) => {
    if (!confirm('Confirm purchase?')) return
    try {
      const res = await api.post('/shop/buy', { productId, quantity })
      setStatusMsg(`Bought! - $${res.data.totalAmount.toFixed(2)}`)
      refreshWallet()
    } catch (err) { setStatusMsg(err.response?.data?.error || 'Purchase failed') }
  }

  const buyPlan = async (planId) => {
    if (!confirm('Activate this subscription plan?')) return
    try {
      const res = await api.post('/shop/buy', { planId })
      setStatusMsg(`Subscribed! - $${res.data.totalAmount.toFixed(2)}`)
      refreshWallet()
    } catch (err) { setStatusMsg(err.response?.data?.error || 'Subscription failed') }
  }

  const refreshWallet = async () => {
    const r = await getMyWallet()
    setBalance(r.data.balance)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-2">Shop</h1>
      <div className="flex items-center gap-4 mb-6">
        <div className="glass px-4 py-2 rounded-xl text-sm">
          Wallet: <span className="text-green-400 font-bold">${balance !== null ? balance.toFixed(2) : '...'}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('products')}
            className={`px-4 py-1 rounded-lg text-sm ${mode === 'products' ? 'bg-red-600' : 'bg-white/10'}`}
          >
            Products
          </button>
          <button
            onClick={() => setMode('subscriptions')}
            className={`px-4 py-1 rounded-lg text-sm ${mode === 'subscriptions' ? 'bg-red-600' : 'bg-white/10'}`}
          >
            Subscriptions
          </button>
        </div>
      </div>

      {statusMsg && <p className="mb-4 text-sm text-gray-300">{statusMsg}</p>}

      {mode === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="glass p-4 rounded-2xl flex flex-col gap-3">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-xs text-gray-400">{product.category}</p>
                <p className="text-sm text-gray-300 mt-1">{product.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-green-400">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => buyProduct(product.id, 1)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="glass p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xl font-bold text-red-400">{plan.name}</h3>
              <p className="text-sm text-gray-300">{plan.description}</p>
              <div className="text-3xl font-bold">${plan.price.toFixed(2)}</div>
              <p className="text-sm text-gray-400">{plan.sessionCount} sessions / month</p>
              <button
                onClick={() => buyPlan(plan.id)}
                className="mt-auto w-full py-2 bg-red-600 hover:bg-red-500 rounded-xl font-semibold"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shop