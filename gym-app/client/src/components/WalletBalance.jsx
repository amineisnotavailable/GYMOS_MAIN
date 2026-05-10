import { useEffect, useState } from 'react'
import { getMyWallet } from '../api/axios'

const WalletBalance = () => {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    getMyWallet()
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(null))
  }, [])

  if (balance === null) return null  // hide if not fetched

  return (
    <div className="flex items-center gap-1 text-sm text-green-400">
      <span>💰</span>
      <span>${balance.toFixed(2)}</span>
    </div>
  )
}

export default WalletBalance