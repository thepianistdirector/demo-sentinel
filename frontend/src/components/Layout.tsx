import { makeStyles, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components'
import {
  Alert24Regular,
  Settings24Regular,
  Person24Regular,
  SignOut24Regular,
} from '@fluentui/react-icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#1b1a19',
    color: '#ffffff',
  },
  header: {
    height: '40px',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderBottom: '1px solid #323130',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#a19f9d',
  },
  headerNavItem: {
    padding: '4px 8px',
    cursor: 'pointer',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '4px',
    color: '#a19f9d',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#a19f9d',
  },
  userEmail: {
    fontSize: '12px',
    color: '#a19f9d',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subHeader: {
    height: '48px',
    backgroundColor: '#252423',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderBottom: '1px solid #323130',
    gap: '12px',
  },
  sentinelIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#0078d4',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentinelTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#a19f9d',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  breadcrumbSeparator: {
    color: '#605e5c',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: '#1b1a19',
  },
})

export function Layout() {
  const styles = useStyles()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.root}>
      {/* Azure Portal Top Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLogo}>
            <div className={styles.microsoftLogo}>
              <div className={styles.logoSquare} style={{ backgroundColor: '#f25022' }} />
              <div className={styles.logoSquare} style={{ backgroundColor: '#7fba00' }} />
              <div className={styles.logoSquare} style={{ backgroundColor: '#00a4ef' }} />
              <div className={styles.logoSquare} style={{ backgroundColor: '#ffb900' }} />
            </div>
            <span className={styles.headerTitle}>Microsoft Azure</span>
          </div>
          <div className={styles.headerNav}>
            <span className={styles.headerNavItem}>Home</span>
            <span className={styles.headerNavItem}>Dashboard</span>
            <span className={styles.headerNavItem}>All services</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerIcon}>
            <Alert24Regular />
          </div>
          <div className={styles.headerIcon}>
            <Settings24Regular />
          </div>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <button className={styles.userButton}>
                <Person24Regular />
                {user && <span className={styles.userEmail}>{user.email}</span>}
              </button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem disabled>
                  Signed in as {user?.email}
                </MenuItem>
                <MenuItem disabled>
                  Role: {user?.role}
                </MenuItem>
                {user?.dataSetId && (
                  <MenuItem disabled>
                    Data Set: {user.dataSetId}
                  </MenuItem>
                )}
                <MenuItem icon={<SignOut24Regular />} onClick={handleLogout}>
                  Sign out
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      {/* Sentinel Sub-Header */}
      <div className={styles.subHeader}>
        <div className={styles.sentinelIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4L8 1zm0 2l4 2v3c0 2.5-1.8 4.7-4 5.5-2.2-.8-4-3-4-5.5V5l4-2z"/>
          </svg>
        </div>
        <span className={styles.sentinelTitle}>Microsoft Sentinel</span>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbSeparator}>|</span>
          <span>Demo-Workspace</span>
        </div>
      </div>

      {/* Main Body */}
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
