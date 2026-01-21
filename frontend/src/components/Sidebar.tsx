import { makeStyles } from '@fluentui/react-components'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home24Regular,
  Home24Filled,
  Warning24Regular,
  Warning24Filled,
  Book24Regular,
  Book24Filled,
  Search24Regular,
  Search24Filled,
  PlugConnected24Regular,
  PlugConnected24Filled,
  DataArea24Regular,
  DataArea24Filled,
  Shield24Regular,
  Shield24Filled,
  Person24Regular,
  Person24Filled,
  DocumentBulletList24Regular,
  DocumentBulletList24Filled,
  Apps24Regular,
  Apps24Filled,
  Play24Regular,
  Play24Filled,
  Settings24Regular,
  Settings24Filled,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  sidebar: {
    width: '240px',
    minWidth: '240px',
    backgroundColor: '#252423',
    borderRight: '1px solid #323130',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarCollapsed: {
    width: '48px',
    minWidth: '48px',
  },
  section: {
    padding: '8px 0',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a19f9d',
    padding: '8px 16px 4px 16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#d2d0ce',
    fontSize: '14px',
    transition: 'background-color 0.1s',
    ':hover': {
      backgroundColor: '#323130',
    },
  },
  navItemActive: {
    backgroundColor: '#0078d4',
    color: '#ffffff',
    ':hover': {
      backgroundColor: '#106ebe',
    },
  },
  navItemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
  },
  navItemText: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  divider: {
    height: '1px',
    backgroundColor: '#323130',
    margin: '8px 16px',
  },
})

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  iconActive: React.ReactNode
}

const generalItems: NavItem[] = [
  { path: '/', label: 'Overview', icon: <Home24Regular />, iconActive: <Home24Filled /> },
  { path: '/incidents', label: 'Incidents', icon: <Warning24Regular />, iconActive: <Warning24Filled /> },
  { path: '/workbooks', label: 'Workbooks', icon: <Book24Regular />, iconActive: <Book24Filled /> },
  { path: '/hunting', label: 'Hunting', icon: <Search24Regular />, iconActive: <Search24Filled /> },
  { path: '/notebooks', label: 'Notebooks', icon: <DocumentBulletList24Regular />, iconActive: <DocumentBulletList24Filled /> },
  { path: '/entity-behavior', label: 'Entity behavior', icon: <Person24Regular />, iconActive: <Person24Filled /> },
  { path: '/threat-intelligence', label: 'Threat intelligence', icon: <Shield24Regular />, iconActive: <Shield24Filled /> },
  { path: '/mitre-attck', label: 'MITRE ATT&CK', icon: <DataArea24Regular />, iconActive: <DataArea24Filled /> },
  { path: '/content-hub', label: 'Content hub', icon: <Apps24Regular />, iconActive: <Apps24Filled /> },
]

const configurationItems: NavItem[] = [
  { path: '/data-connectors', label: 'Data connectors', icon: <PlugConnected24Regular />, iconActive: <PlugConnected24Filled /> },
  { path: '/analytics', label: 'Analytics', icon: <DataArea24Regular />, iconActive: <DataArea24Filled /> },
  { path: '/watchlists', label: 'Watchlists', icon: <DocumentBulletList24Regular />, iconActive: <DocumentBulletList24Filled /> },
  { path: '/automation', label: 'Automation', icon: <Play24Regular />, iconActive: <Play24Filled /> },
  { path: '/settings', label: 'Settings', icon: <Settings24Regular />, iconActive: <Settings24Filled /> },
]

const logsItem: NavItem = {
  path: '/logs',
  label: 'Logs',
  icon: <Search24Regular />,
  iconActive: <Search24Filled />,
}

export function Sidebar() {
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path
    return (
      <div
        key={item.path}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        onClick={() => navigate(item.path)}
      >
        <div className={styles.navItemIcon}>
          {isActive ? item.iconActive : item.icon}
        </div>
        <span className={styles.navItemText}>{item.label}</span>
      </div>
    )
  }

  return (
    <nav className={styles.sidebar}>
      {/* General Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>General</div>
        {generalItems.map(renderNavItem)}
      </div>

      <div className={styles.divider} />

      {/* Logs - Special Item */}
      {renderNavItem(logsItem)}

      <div className={styles.divider} />

      {/* Configuration Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Configuration</div>
        {configurationItems.map(renderNavItem)}
      </div>
    </nav>
  )
}
