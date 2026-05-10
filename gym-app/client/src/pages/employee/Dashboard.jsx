const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold text-red-500 mb-6">Employee Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass p-6 rounded-2xl">
        <p className="text-gray-400 text-sm">Attendance Today</p>
        <p className="text-3xl font-bold">...</p>
      </div>
      <div className="glass p-6 rounded-2xl">
        <p className="text-gray-400 text-sm">Pending Notifications</p>
        <p className="text-3xl font-bold">...</p>
      </div>
    </div>
  </div>
);
export default Dashboard;