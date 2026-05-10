import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { getAllAthletes } from '../../api/axios'; // we'll use same get all athletes endpoint

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    getAllAthletes()
      .then(res => setAthletes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAttendance = async (athleteId, status) => {
    try {
      await api.post('/employee/attendance', { athleteId, status });
      setStatusMsg('Attendance recorded.');
      setTimeout(() => setStatusMsg(''), 2000);
    } catch (err) {
      setStatusMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <p className="text-gray-400">Loading athletes...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 mb-6">Athletes Attendance</h1>
      {statusMsg && <p className="mb-4 text-sm text-gray-300">{statusMsg}</p>}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-red-800/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((profile) => (
              <tr key={profile.id} className="border-b border-gray-800 hover:bg-red-900/10">
                <td className="py-3 px-4 font-medium">{profile.user.firstName} {profile.user.lastName}</td>
                <td className="py-3 px-4 text-gray-300">{profile.level}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => markAttendance(profile.id, 'PRESENT')} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm">Present</button>
                  <button onClick={() => markAttendance(profile.id, 'ABSENT')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm">Absent</button>
                  <button onClick={() => markAttendance(profile.id, 'EXCUSED')} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm">Excused</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Athletes;