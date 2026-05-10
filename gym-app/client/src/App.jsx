import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'

import OwnerDashboard from './pages/owner/Dashboard'
import OwnerUsers from './pages/owner/Users'
import OwnerRequests from './pages/owner/Requests'
import OwnerEmployees from './pages/owner/Employees'
import OwnerEmployers from './pages/owner/Employers'
import OwnerPayUser from './pages/owner/PayUser'
import OwnerNotifications from './pages/owner/Notifications'
import OwnerReports from './pages/owner/Reports'
import OwnerWallet from './pages/owner/Wallet'

import AdminDashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import AddCoach from './pages/admin/AddCoach'
import Employers from './pages/admin/Employers'
import Employees from './pages/admin/Employees'
import AdminNotifications from './pages/admin/Notifications'
import Reports from './pages/admin/Reports'

import EmployerDashboard from './pages/employer/Dashboard';
import EmployerEmployees from './pages/employer/Employees';
import EmployerWithdrawalRequests from './pages/employer/WithdrawalRequests';
import EmployerNotifications from './pages/employer/Notifications';
import EmployerPayUser from './pages/employer/PayUser';
import AdminWallet from './pages/admin/Wallet';
import EmployeeWallet from './pages/employee/Wallet';

import CoachDashboard from './pages/coach/Dashboard'
import MyAthletes from './pages/coach/MyAthletes'
import CoachSchedule from './pages/coach/Schedule'
import CoachNotifications from './pages/coach/Notifications'
import Requests from './pages/admin/Requests'
import AthleteDashboard from './pages/athlete/Dashboard'
import Profile from './pages/athlete/Profile'
import Sports from './pages/athlete/Sports'
import AthleteSchedule from './pages/athlete/Schedule'
import AthleteNotifications from './pages/athlete/Notifications'
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeAthletes from './pages/employee/Athletes';
import EmployeeNotifications from './pages/employee/Notifications';

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><Layout role="ADMIN" /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="wallet" element={<AdminWallet />} />
        <Route path="users" element={<Users />} />
        <Route path="add-coach" element={<AddCoach />} />
        <Route path="requests" element={<Requests />} />
        <Route path="employers" element={<Employers />} />
        <Route path="employees" element={<Employees />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reports" element={<Reports />} />
      </Route>

        {/* Owner */}
      <Route path="/owner" element={<ProtectedRoute roles={['OWNER']}><Layout role="OWNER" /></ProtectedRoute>}>
         <Route index element={<OwnerDashboard />} />
         <Route path="users" element={<OwnerUsers />} />
         <Route path="requests" element={<OwnerRequests />} />
         <Route path="employees" element={<OwnerEmployees />} />
         <Route path="employers" element={<OwnerEmployers />} />
         <Route path="pay-user" element={<OwnerPayUser />} />
         <Route path="notifications" element={<OwnerNotifications />} />
         <Route path="reports" element={<OwnerReports />} />
         <Route path="wallet" element={<OwnerWallet />} />
      </Route>

      {/* Coach */}
      <Route path="/coach" element={<ProtectedRoute roles={['COACH']}><Layout role="COACH" /></ProtectedRoute>}>
        <Route index element={<CoachDashboard />} />
        <Route path="athletes" element={<MyAthletes />} />
        <Route path="schedule" element={<CoachSchedule />} />
        <Route path="notifications" element={<CoachNotifications />} />
      </Route>

      {/* Athlete */}
      <Route path="/athlete" element={<ProtectedRoute roles={['ATHLETE']}><Layout role="ATHLETE" /></ProtectedRoute>}>
        <Route index element={<AthleteDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sports" element={<Sports />} />
        <Route path="schedule" element={<AthleteSchedule />} />
        <Route path="notifications" element={<AthleteNotifications />} />
      </Route>

      <Route path="/employee" element={<ProtectedRoute roles={['EMPLOYEE']}><Layout role="EMPLOYEE" /></ProtectedRoute>}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="wallet" element={<EmployeeWallet />} />
        <Route path="athletes" element={<EmployeeAthletes />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
      </Route>

      <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <Navigate to="/login" />} />
      <Route path="*" element={<div className="text-white p-10">404 Not Found</div>} />

          {/* Employer */}
    <Route path="/employer" element={<ProtectedRoute roles={['EMPLOYER']}><Layout role="EMPLOYER" /></ProtectedRoute>}>
      <Route index element={<EmployerDashboard />} />
      <Route path="employees" element={<EmployerEmployees />} />
      <Route path="pay-user" element={<EmployerPayUser />} />
      <Route path="withdrawals" element={<EmployerWithdrawalRequests />} />
      <Route path="notifications" element={<EmployerNotifications />} />
    </Route>

    {/* Admin Wallet */}
    <Route path="admin/wallet" element={<ProtectedRoute roles={['ADMIN']}><Layout role="ADMIN" /></ProtectedRoute>}>
      <Route index element={<AdminWallet />} />
    </Route>
    </Routes>
  )

  
    {/* Actually, add wallet inside existing admin block */}
    }

    const App = () => (
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    )

    export default App