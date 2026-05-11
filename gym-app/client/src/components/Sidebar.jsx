import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import {
  DashboardIcon, UsersIcon, BriefcaseIcon, BellIcon, ChartIcon,
  ClipboardIcon, UserIcon, CalendarIcon, SportsIcon, UserPlusIcon, ClipboardCheckIcon,
  ShopIcon
} from './Icons'

const adminTabs = [
  { to: '/admin', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/admin/users', label: 'Users', Icon: UsersIcon },
  { to: '/admin/requests', label: 'Requests', Icon: ClipboardCheckIcon },
  { to: '/admin/employees', label: 'Employees', Icon: BriefcaseIcon },
  { to: '/admin/employers', label: 'Employers', Icon: UserPlusIcon },   // ← new
  { to: '/admin/notifications', label: 'Notifications', Icon: BellIcon },
  { to: '/admin/reports', label: 'Reports', Icon: ChartIcon },
  { to: '/admin/add-coach', label: 'Add Coach', Icon: UserPlusIcon },
  { to: '/admin/wallet', label: 'Wallet', Icon: UserIcon },
]

const coachTabs = [
  { to: '/coach', label: 'Dashboard', Icon: ClipboardIcon, end: true },
  { to: '/coach/athletes', label: 'My Athletes', Icon: UsersIcon },
  { to: '/coach/schedule', label: 'Schedule', Icon: CalendarIcon },
  { to: '/coach/notifications', label: 'Notifications', Icon: BellIcon },
]

const athleteTabs = [
  { to: '/athlete', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/athlete/shop', label: 'Shop', Icon: ShopIcon },  // you can use a different icon
  { to: '/athlete/profile', label: 'Profile', Icon: UserIcon },
  { to: '/athlete/sports', label: 'Sports', Icon: SportsIcon },
  { to: '/athlete/schedule', label: 'Schedule', Icon: CalendarIcon },
  { to: '/athlete/notifications', label: 'Notifications', Icon: BellIcon },
]

const employeeTabs = [
  { to: '/employee', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/employee/athletes', label: 'Athletes', Icon: UsersIcon },
  { to: '/employee/sales', label: 'Sales', Icon: ChartIcon },
  { to: '/employee/notifications', label: 'Notifications', Icon: BellIcon },
  { to: '/employee/wallet', label: 'Wallet', Icon: UserIcon },
]

const employerTabs = [
  { to: '/employer', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/employer/employees', label: 'Employees', Icon: BriefcaseIcon },
  { to: '/employer/pay-user', label: 'Pay User', Icon: UserPlusIcon },
  { to: '/employer/withdrawals', label: 'Withdrawals', Icon: BellIcon },
  { to: '/employer/notifications', label: 'Notifications', Icon: BellIcon },
]

const ownerTabs = [
  { to: '/owner', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/owner/users', label: 'Users', Icon: UsersIcon },
  { to: '/owner/requests', label: 'Requests', Icon: ClipboardCheckIcon },
  { to: '/owner/employees', label: 'Employees', Icon: BriefcaseIcon },
  { to: '/owner/employers', label: 'Employers', Icon: UserPlusIcon },
  { to: '/owner/pay-user', label: 'Pay User', Icon: UserPlusIcon },
  { to: '/owner/sales', label: 'Sales', Icon: ChartIcon },
  { to: '/owner/notifications', label: 'Notifications', Icon: BellIcon },
  { to: '/owner/reports', label: 'Reports', Icon: ChartIcon },
  { to: '/owner/wallet', label: 'Wallet', Icon: UserIcon },
]

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth()

  // Choose the correct tabs
  const tabs = role === 'ADMIN' ? adminTabs :
             role === 'COACH' ? coachTabs :
             role === 'ATHLETE' ? athleteTabs :
             role === 'EMPLOYEE' ? employeeTabs :
             role === 'EMPLOYER' ? employerTabs :
             /* OWNER */ ownerTabs;

  return (
    <aside className="w-64 bg-black/80 backdrop-blur-md border-r border-red-800 flex flex-col">
      <div className="p-6 text-2xl font-bold text-red-500 border-b border-red-800 tracking-widest">GYM</div>

      {role === 'COACH' && user && !user.isApproved && (
        <div className="px-6 py-3 bg-yellow-900/30 border-b border-yellow-700/50 text-yellow-400 text-xs">
          Your account is pending admin approval. You will have full access once approved.
        </div>
      )}

      <nav className="flex-1 mt-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition ${
                isActive
                  ? 'bg-red-600/20 text-red-400 border-r-2 border-red-500'
                  : 'hover:bg-red-900/10 text-gray-400 hover:text-white'
              }`
            }
          >
            <tab.Icon />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="m-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
      >
        Logout
      </button>
    </aside>
  )
}

export default Sidebar