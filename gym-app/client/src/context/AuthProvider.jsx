import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          firstName: payload.firstName,
          lastName: payload.lastName,
          isApproved: payload.isApproved ?? true,
        })
      } catch {
        localStorage.removeItem('token')
        setToken(null)
      }
    }
  }, [token])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    // Use the user object from the response (it contains names)
    setUser(res.data.user)
  }

  const register = async (data) => {
    const res = await apiRegister(data)
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    } else {
      alert(res.data.message || 'Coach account created. Please log in. It will be activated after admin approval.')
      return res.data
    }
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = () => {
    const currentToken = localStorage.getItem('token')
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]))
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          firstName: payload.firstName,
          lastName: payload.lastName,
          isApproved: payload.isApproved ?? true,
        })
      } catch {
        logout()
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)