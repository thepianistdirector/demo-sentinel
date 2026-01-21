import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../services/authService'
import { login as authLogin, parseToken } from '../services/authService'

const AUTH_TOKEN_KEY = 'demo_sentinel_auth_token'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      const parsedUser = parseToken(token)
      if (parsedUser) {
        setUser(parsedUser)
      } else {
        // Token expired or invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authLogin(email, password)

    if (response.success && response.user && response.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token)
      setUser(response.user)
      return { success: true }
    }

    return { success: false, error: response.error }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
