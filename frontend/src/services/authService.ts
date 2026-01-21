export interface User {
  email: string
  role: 'admin' | 'client'
  dataSetId?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Mock users for demo
const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    user: { email: 'admin@demo.com', role: 'admin' },
  },
  {
    email: 'client@demo.com',
    password: 'client123',
    user: { email: 'client@demo.com', role: 'client', dataSetId: 'healthcare' },
  },
]

// Simple mock JWT generator (NOT cryptographically secure - demo only)
function generateMockToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: user.email,
      role: user.role,
      dataSetId: user.dataSetId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  )
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (found) {
    return {
      success: true,
      user: found.user,
      token: generateMockToken(found.user),
    }
  }

  return {
    success: false,
    error: 'Invalid email or password',
  }
}

export function parseToken(token: string): User | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return null
    }

    return {
      email: payload.sub,
      role: payload.role,
      dataSetId: payload.dataSetId,
    }
  } catch {
    return null
  }
}
