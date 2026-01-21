import { makeStyles, Input } from '@fluentui/react-components'
import {
  Search24Regular,
  Checkmark24Regular,
  Warning24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 600,
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchBox: {
    width: '300px',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    padding: '16px',
    backgroundColor: '#252423',
    borderRadius: '4px',
    border: '1px solid #323130',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '14px',
    color: '#a19f9d',
  },
  connectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  connectorCard: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    ':hover': {
      borderColor: '#0078d4',
    },
  },
  connectorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  connectorIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#0078d4',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#ffffff',
    fontWeight: 600,
  },
  connectorInfo: {
    flex: 1,
  },
  connectorName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '4px',
  },
  connectorProvider: {
    fontSize: '13px',
    color: '#a19f9d',
  },
  connectorStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
  },
  statusConnected: {
    color: '#6ccb5f',
  },
  statusNotConnected: {
    color: '#a19f9d',
  },
  statusError: {
    color: '#f87c7c',
  },
  connectorDescription: {
    fontSize: '13px',
    color: '#a19f9d',
    lineHeight: '1.5',
  },
  connectorMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #323130',
  },
  lastDataReceived: {
    fontSize: '12px',
    color: '#605e5c',
  },
  dataTypes: {
    display: 'flex',
    gap: '4px',
  },
  dataTypeBadge: {
    padding: '2px 6px',
    backgroundColor: '#323130',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#a19f9d',
  },
})

const connectors = [
  {
    name: 'Microsoft Defender for Endpoint',
    provider: 'Microsoft',
    icon: 'MD',
    status: 'connected',
    description: 'Connect Microsoft Defender for Endpoint to gain visibility into endpoint activities.',
    lastData: '2 minutes ago',
    dataTypes: ['SecurityAlert', 'DeviceInfo'],
  },
  {
    name: 'Azure Active Directory',
    provider: 'Microsoft',
    icon: 'AD',
    status: 'connected',
    description: 'Collect Azure AD sign-in logs and audit logs for identity threat detection.',
    lastData: '5 minutes ago',
    dataTypes: ['SigninLogs', 'AuditLogs'],
  },
  {
    name: 'Microsoft 365 Defender',
    provider: 'Microsoft',
    icon: '365',
    status: 'connected',
    description: 'Ingest alerts and incidents from Microsoft 365 Defender suite.',
    lastData: '1 minute ago',
    dataTypes: ['SecurityIncident', 'SecurityAlert'],
  },
  {
    name: 'Azure Activity',
    provider: 'Microsoft',
    icon: 'AZ',
    status: 'connected',
    description: 'Monitor Azure subscription activity and resource changes.',
    lastData: '10 minutes ago',
    dataTypes: ['AzureActivity'],
  },
  {
    name: 'Palo Alto Networks',
    provider: 'Palo Alto',
    icon: 'PA',
    status: 'connected',
    description: 'Collect firewall logs from Palo Alto Networks devices.',
    lastData: '3 minutes ago',
    dataTypes: ['CommonSecurityLog'],
  },
  {
    name: 'AWS CloudTrail',
    provider: 'Amazon',
    icon: 'AWS',
    status: 'error',
    description: 'Ingest AWS CloudTrail logs for cloud security monitoring.',
    lastData: 'Connection error',
    dataTypes: ['AWSCloudTrail'],
  },
  {
    name: 'Cisco ASA',
    provider: 'Cisco',
    icon: 'CSC',
    status: 'not_connected',
    description: 'Connect Cisco ASA firewalls for network security monitoring.',
    lastData: 'Not configured',
    dataTypes: ['CommonSecurityLog'],
  },
  {
    name: 'Windows Security Events',
    provider: 'Microsoft',
    icon: 'WIN',
    status: 'connected',
    description: 'Collect Windows Security events via Azure Monitor Agent.',
    lastData: '1 minute ago',
    dataTypes: ['SecurityEvent'],
  },
]

export function DataConnectors() {
  const styles = useStyles()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Checkmark24Regular className={styles.statusConnected} />
      case 'error':
        return <Warning24Regular className={styles.statusError} />
      default:
        return <Dismiss24Regular className={styles.statusNotConnected} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'error': return 'Error'
      default: return 'Not connected'
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'connected': return styles.statusConnected
      case 'error': return styles.statusError
      default: return styles.statusNotConnected
    }
  }

  const connectedCount = connectors.filter(c => c.status === 'connected').length

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Data connectors</h1>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchBox}
            placeholder="Search connectors..."
            contentBefore={<Search24Regular />}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{connectedCount}</span>
          <span className={styles.statLabel}>Connected</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{connectors.length - connectedCount}</span>
          <span className={styles.statLabel}>Not connected</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{connectors.length}</span>
          <span className={styles.statLabel}>Total available</span>
        </div>
      </div>

      <div className={styles.connectorGrid}>
        {connectors.map((connector, index) => (
          <div key={index} className={styles.connectorCard}>
            <div className={styles.connectorHeader}>
              <div className={styles.connectorIcon}>{connector.icon}</div>
              <div className={styles.connectorInfo}>
                <div className={styles.connectorName}>{connector.name}</div>
                <div className={styles.connectorProvider}>{connector.provider}</div>
              </div>
              <div className={`${styles.connectorStatus} ${getStatusStyle(connector.status)}`}>
                {getStatusIcon(connector.status)}
                <span>{getStatusText(connector.status)}</span>
              </div>
            </div>
            <div className={styles.connectorDescription}>{connector.description}</div>
            <div className={styles.connectorMeta}>
              <span className={styles.lastDataReceived}>Last data: {connector.lastData}</span>
              <div className={styles.dataTypes}>
                {connector.dataTypes.map((type, i) => (
                  <span key={i} className={styles.dataTypeBadge}>{type}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
