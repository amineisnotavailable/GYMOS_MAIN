import { useEffect, useState } from 'react'
import { getAthleteProfile, addSportToAthlete } from '../../api/axios'

const Sports = () => {
  const [sports, setSports] = useState([])
  const [sportId, setSportId] = useState('')

  useEffect(() => {
    getAthleteProfile().then(res => setSports(res.data.sports || [])).catch(console.error)
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!sportId) return
    await addSportToAthlete(parseInt(sportId))
    setSportId('')
    // refresh
    const res = await getAthleteProfile()
    setSports(res.data.sports || [])
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">My Sports</h1>
      
      <div className="glass p-6 rounded-2xl mb-6 max-w-md">
        <form onSubmit={handleAdd} className="flex gap-4">
          <input type="number" placeholder="Sport ID" value={sportId} onChange={e => setSportId(e.target.value)} required className="flex-1 p-3 rounded-xl bg-transparent border border-white/10 text-white" />
          <button type="submit" className="py-3 px-6 bg-red-600 hover:bg-red-500 rounded-xl font-semibold">Add</button>
        </form>
      </div>

      <div className="space-y-3">
        {sports.map((as) => (
          <div key={as.sportId} className="glass p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{as.sport.name}</p>
              <p className="text-sm text-gray-400">Cost: ${as.sport.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sports