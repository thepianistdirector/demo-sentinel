import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  makeStyles,
  Input,
  Button,
  Spinner,
} from '@fluentui/react-components'
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#1b1a19',
  },
  header: {
    height: '48px',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    borderBottom: '1px solid #323130',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  microsoftLogo: {
    width: '16px',
    height: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
  },
  logoSquare: {
    width: '7px',
    height: '7px',
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  loginCard: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '8px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
  },
  sentinelBranding: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  sentinelIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#0078d4',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentinelTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#a19f9d',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#1b1a19',
  },
  errorMessage: {
    backgroundColor: 'rgba(248, 124, 124, 0.1)',
    border: '1px solid #f87c7c',
    borderRadius: '4px',
    padding: '12px',
    color: '#f87c7c',
    fontSize: '13px',
  },
  submitButton: {
    marginTop: '8px',
    height: '40px',
    backgroundColor: '#0078d4',
    color: '#ffffff',
    fontWeight: 600,
  },
  demoCredentials: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #323130',
  },
  demoTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#a19f9d',
    marginBottom: '12px',
  },
  demoList: {
    fontSize: '12px',
    color: '#605e5c',
    lineHeight: '1.8',
  },
  demoItem: {
    fontFamily: 'monospace',
  },
})

export function Login() {
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Login failed')
    }

    setIsLoading(false)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.microsoftLogo}>
            <div className={styles.logoSquare} style={{ backgroundColor: '#f25022' }} />
            <div className={styles.logoSquare} style={{ backgroundColor: '#7fba00' }} />
            <div className={styles.logoSquare} style={{ backgroundColor: '#00a4ef' }} />
            <div className={styles.logoSquare} style={{ backgroundColor: '#ffb900' }} />
          </div>
          <span className={styles.headerTitle}>Microsoft Azure</span>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.sentinelBranding}>
            <div className={styles.sentinelIcon}>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
                <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4L8 1zm0 2l4 2v3c0 2.5-1.8 4.7-4 5.5-2.2-.8-4-3-4-5.5V5l4-2z" />
              </svg>
            </div>
            <span className={styles.sentinelTitle}>Microsoft Sentinel</span>
          </div>

          <p className={styles.subtitle}>Sign in to access the Demo Portal</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <Input
                className={styles.input}
                type="email"
                value={email}
                onChange={(_, data) => setEmail(data.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <Input
                className={styles.input}
                type="password"
                value={password}
                onChange={(_, data) => setPassword(data.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              className={styles.submitButton}
              appearance="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="tiny" /> : 'Sign in'}
            </Button>
          </form>

          <div className={styles.demoCredentials}>
            <div className={styles.demoTitle}>Demo Credentials</div>
            <div className={styles.demoList}>
              <div className={styles.demoItem}>Admin: admin@demo.com / admin123</div>
              <div className={styles.demoItem}>Client: client@demo.com / client123</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
