import { makeStyles } from '@fluentui/react-components'
import {
  Warning24Regular,
  ShieldCheckmark24Regular,
  DataUsage24Regular,
  ArrowTrending24Regular,
} from '@fluentui/react-icons'
import { useData } from '../contexts/DataContext'

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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#a19f9d',
    fontSize: '14px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 600,
    color: '#ffffff',
  },
  statValueDanger: {
    color: '#f87c7c',
  },
  statValueWarning: {
    color: '#ffd335',
  },
  statValueSuccess: {
    color: '#6ccb5f',
  },
  statTrend: {
    fontSize: '13px',
    color: '#a19f9d',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  chartCard: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '4px',
    padding: '20px',
    minHeight: '300px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '16px',
  },
  chartPlaceholder: {
    height: '240px',
    backgroundColor: '#1b1a19',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#605e5c',
    fontSize: '14px',
  },
  recentIncidents: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '4px',
    padding: '20px',
  },
  incidentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  incidentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#1b1a19',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  incidentSeverity: {
    width: '4px',
    height: '40px',
    borderRadius: '2px',
  },
  severityHigh: {
    backgroundColor: '#f87c7c',
  },
  severityMedium: {
    backgroundColor: '#ffd335',
  },
  severityLow: {
    backgroundColor: '#0078d4',
  },
  severityInfo: {
    backgroundColor: '#a19f9d',
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
  },
  incidentMeta: {
    fontSize: '12px',
    color: '#a19f9d',
    marginTop: '4px',
  },
  dataSetBanner: {
    backgroundColor: '#0e3a5c',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#4fc3f7',
    marginBottom: '8px',
  },
})

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return 'Just now'
}

export function Overview() {
  const styles = useStyles()
  const { incidents, alerts, currentDataSet, connectors } = useData()

  const activeIncidents = incidents.filter(i => i.status !== 'Closed')
  const highSeverityIncidents = incidents.filter(i => i.severity === 'High' && i.status !== 'Closed')
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    .slice(0, 4)

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High': return styles.severityHigh
      case 'Medium': return styles.severityMedium
      case 'Low': return styles.severityLow
      default: return styles.severityInfo
    }
  }

  return (
    <div className={styles.root}>
      {currentDataSet && (
        <div className={styles.dataSetBanner}>
          Viewing data set: {currentDataSet.name} ({currentDataSet.industry})
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Warning24Regular />
            <span>Active Incidents</span>
          </div>
          <div className={`${styles.statValue} ${styles.statValueDanger}`}>{activeIncidents.length}</div>
          <div className={styles.statTrend}>
            <ArrowTrending24Regular />
            {incidents.length} total incidents
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <ShieldCheckmark24Regular />
            <span>Active Alerts</span>
          </div>
          <div className={styles.statValue}>{alerts.filter(a => a.status !== 'Resolved' && a.status !== 'Dismissed').length}</div>
          <div className={styles.statTrend}>
            {alerts.length} total alerts
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <DataUsage24Regular />
            <span>Data Connectors</span>
          </div>
          <div className={`${styles.statValue} ${styles.statValueSuccess}`}>{connectors.filter(c => c.status === 'connected').length}</div>
          <div className={styles.statTrend}>
            {connectors.length} configured
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Warning24Regular />
            <span>High Severity</span>
          </div>
          <div className={`${styles.statValue} ${styles.statValueWarning}`}>{highSeverityIncidents.length}</div>
          <div className={styles.statTrend}>
            Requires attention
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Security Analytics</h2>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Incidents Over Time</h3>
            <div className={styles.chartPlaceholder}>
              Chart visualization will appear here
            </div>
          </div>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Incidents by Severity</h3>
            <div className={styles.chartPlaceholder}>
              Chart visualization will appear here
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className={styles.recentIncidents}>
        <h3 className={styles.chartTitle}>Recent Incidents</h3>
        <div className={styles.incidentList}>
          {recentIncidents.map((incident) => (
            <div key={incident.id} className={styles.incidentItem}>
              <div className={`${styles.incidentSeverity} ${getSeverityStyle(incident.severity)}`} />
              <div className={styles.incidentInfo}>
                <div className={styles.incidentTitle}>{incident.title}</div>
                <div className={styles.incidentMeta}>
                  {incident.id} • Created {formatTimeAgo(incident.createdTime)} • {incident.owner || 'Unassigned'}
                </div>
              </div>
            </div>
          ))}
          {recentIncidents.length === 0 && (
            <div className={styles.incidentMeta}>No incidents to display</div>
          )}
        </div>
      </div>
    </div>
  )
}
