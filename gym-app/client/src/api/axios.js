import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

// Admin
export const getUsers = () => api.get('/admin/users')
export const getEmployees = () => api.get('/admin/employees')
export const createEmployee = (data) => api.post('/admin/employees', data)
export const fireEmployee = (id) => api.put(`/admin/employees/${id}/fire`)
export const pushNotification = (data) => api.post('/admin/notifications', data)
export const getReports = () => api.get('/admin/reports')
export const getPendingCoaches = () => api.get('/admin/pending-coaches')
export const approveCoach = (coachProfileId) => api.put(`/admin/approve-coach/${coachProfileId}`)
export const rejectCoach = (coachProfileId) => api.delete(`/admin/reject-coach/${coachProfileId}`)

export const getMyWallet = () => api.get('/wallet/mywallet')
export const payWithCard = (cardId) => api.post('/wallet/pay', { cardId })
export const getGymRevenue = () => api.get('/admin/revenue')

// Coach
export const getCoachAthletes = () => api.get('/coach/athletes')
export const getAllAthletes = () => api.get('/coach/all-athletes')
export const assignAthleteToCoach = (athleteId) => api.post('/coach/assign-athlete', { athleteId })
export const getCoachSchedule = () => api.get('/coach/schedule')
export const createSession = (data) => api.post('/coach/sessions', data)
export const sendCoachReminder = (data) => api.post('/coach/remind', data)
export const getCoachNotifications = () => api.get('/coach/notifications')
export const markCoachNotificationRead = (id) => api.put(`/coach/notifications/${id}/read`)

// Athlete
export const getAthleteProfile = () => api.get('/athlete/profile')
export const getAthleteSessions = () => api.get('/athlete/sessions')
export const getAthleteNotifications = () => api.get('/athlete/notifications')
export const markAthleteNotificationRead = (id) => api.put(`/athlete/notifications/${id}/read`)
export const addSportToAthlete = (sportId) => api.post('/athlete/sports', { sportId })

export default api