import { useEffect, useState } from 'react'
import { getCoachAthletes, getAllAthletes, assignAthleteToCoach } from '../../api/axios'
import api from '../../api/axios'

const MyAthletes = () => {
  const [myAthletes, setMyAthletes] = useState([])
  const [allAthletes, setAllAthletes] = useState([])
  const [selectedAthleteId, setSelectedAthleteId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    fetchMyAthletes()
    fetchAllAthletes()
  }, [])

  const fetchMyAthletes = async () => {
    try {
      const res = await getCoachAthletes()
      setMyAthletes(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchAllAthletes = async () => {
    try {
      const res = await getAllAthletes()
      setAllAthletes(res.data)
    } catch (err) { console.error(err) }
  }

  const unassignedAthletes = allAthletes.filter(
    (a) => !myAthletes.some((mine) => mine.id === a.id)
  )

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selectedAthleteId) return
    setAssigning(true)
    try {
      await assignAthleteToCoach(parseInt(selectedAthleteId))
      setSelectedAthleteId('')
      fetchMyAthletes()
      fetchAllAthletes()
    } catch (err) {
      alert('Assign failed')
    } finally {
      setAssigning(false)
    }
  }

  const handleLevelChange = async (athleteId, newLevel) => {
    try {
      await api.put(`/coach/athletes/${athleteId}/level`, { level: newLevel })
      setStatusMsg('Level updated')
      fetchMyAthletes()
    } catch (err) {
      setStatusMsg(err.response?.data?.error || 'Update failed')
    }
    setTimeout(() => setStatusMsg(''), 2000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">My Athletes</h1>
      {statusMsg && <p className="mb-4 text-sm text-gray-300">{statusMsg}</p>}

      {/* Assign new athlete */}
      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Athlete to My Roster</h2>
        <form onSubmit={handleAssign} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-300 mb-1">Select Athlete</label>
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
            >
              <option value="" className="bg-gray-900">-- Choose an athlete --</option>
              {unassignedAthletes.map((profile) => (
                <option key={profile.id} value={profile.id} className="bg-gray-900">
                  {profile.user.firstName} {profile.user.lastName} ({profile.level})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={assigning || !selectedAthleteId}
            className="py-3 px-6 bg-red-600 hover:bg-red-500 rounded-xl font-semibold disabled:opacity-50"
          >
            Assign
          </button>
        </form>
      </div>

      {/* My athletes list with level selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAthletes.length === 0 && (
          <div className="col-span-2 glass p-8 rounded-xl text-center text-gray-400">
            No athletes assigned yet.
          </div>
        )}
        {myAthletes.map((profile) => (
          <div key={profile.id} className="glass p-5 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{profile.user.firstName} {profile.user.lastName}</p>
                <p className="text-sm text-gray-400">{profile.maturity} · {profile.level}</p>
              </div>
              <div className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded-full">
                {profile.competitionValidity ? 'Competition' : 'Training'}
              </div>
            </div>

            {/* Level selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Change level:</label>
              <select
                value={profile.level}
                onChange={(e) => handleLevelChange(profile.id, e.target.value)}
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="AMATEUR" className="bg-gray-900">Amateur</option>
                <option value="INTERMEDIATE" className="bg-gray-900">Intermediate</option>
                <option value="PROFESSIONAL" className="bg-gray-900">Professional</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAthletes