import { makeStyles, Title1, Title3, Card, CardHeader, Text } from '@fluentui/react-components'
import {
  Warning24Regular,
  ShieldCheckmark24Regular,
  DataUsage24Regular,
  ArrowTrending24Regular,
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
    ':hover': {
      backgroundColor: '#323130',
    },
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
})

export function Overview() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
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
          <div className={`${styles.statValue} ${styles.statValueDanger}`}>23</div>
          <div className={styles.statTrend}>
            <ArrowTrending24Regular />
            +5 from last week
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <ShieldCheckmark24Regular />
            <span>Analytics Rules</span>
          </div>
          <div className={styles.statValue}>156</div>
          <div className={styles.statTrend}>
            142 enabled
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <DataUsage24Regular />
            <span>Data Ingestion</span>
          </div>
          <div className={`${styles.statValue} ${styles.statValueSuccess}`}>2.4GB</div>
          <div className={styles.statTrend}>
            Last 24 hours
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <Warning24Regular />
            <span>High Severity</span>
          </div>
          <div className={`${styles.statValue} ${styles.statValueWarning}`}>7</div>
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
          <div className={styles.incidentItem}>
            <div className={`${styles.incidentSeverity} ${styles.severityHigh}`} />
            <div className={styles.incidentInfo}>
              <div className={styles.incidentTitle}>Suspicious login from unknown location</div>
              <div className={styles.incidentMeta}>INC-2024-001 • Created 2 hours ago • Assigned to: John Doe</div>
            </div>
          </div>
          <div className={styles.incidentItem}>
            <div className={`${styles.incidentSeverity} ${styles.severityHigh}`} />
            <div className={styles.incidentInfo}>
              <div className={styles.incidentTitle}>Multiple failed authentication attempts</div>
              <div className={styles.incidentMeta}>INC-2024-002 • Created 4 hours ago • Unassigned</div>
            </div>
          </div>
          <div className={styles.incidentItem}>
            <div className={`${styles.incidentSeverity} ${styles.severityMedium}`} />
            <div className={styles.incidentInfo}>
              <div className={styles.incidentTitle}>Anomalous network traffic detected</div>
              <div className={styles.incidentMeta}>INC-2024-003 • Created 6 hours ago • Assigned to: Jane Smith</div>
            </div>
          </div>
          <div className={styles.incidentItem}>
            <div className={`${styles.incidentSeverity} ${styles.severityLow}`} />
            <div className={styles.incidentInfo}>
              <div className={styles.incidentTitle}>New device enrolled in network</div>
              <div className={styles.incidentMeta}>INC-2024-004 • Created 8 hours ago • Closed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
