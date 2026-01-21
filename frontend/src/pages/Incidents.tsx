import { makeStyles, Button, Dropdown, Option, Input } from '@fluentui/react-components'
import {
  Search24Regular,
  ArrowSync24Regular,
} from '@fluentui/react-icons'
import { useData } from '../contexts/DataContext'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%',
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
    padding: '12px 0',
    borderBottom: '1px solid #323130',
  },
  searchBox: {
    width: '300px',
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  table: {
    flex: 1,
    overflow: 'auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 80px 1fr 120px 120px 150px 100px',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#252423',
    borderBottom: '1px solid #323130',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  tableHeaderCell: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a19f9d',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '40px 80px 1fr 120px 120px 150px 100px',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #323130',
    cursor: 'pointer',
  },
  tableCell: {
    fontSize: '14px',
    color: '#d2d0ce',
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#0078d4',
  },
  severityBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
  },
  severityHigh: {
    backgroundColor: '#442726',
    color: '#f87c7c',
  },
  severityMedium: {
    backgroundColor: '#433519',
    color: '#ffd335',
  },
  severityLow: {
    backgroundColor: '#0e3a5c',
    color: '#4fc3f7',
  },
  severityInfo: {
    backgroundColor: '#323130',
    color: '#a19f9d',
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  statusNew: {
    backgroundColor: '#0e3a5c',
    color: '#4fc3f7',
  },
  statusActive: {
    backgroundColor: '#433519',
    color: '#ffd335',
  },
  statusClosed: {
    backgroundColor: '#1e3a29',
    color: '#6ccb5f',
  },
  incidentTitle: {
    color: '#ffffff',
    fontWeight: 500,
  },
  incidentId: {
    color: '#0078d4',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderTop: '1px solid #323130',
  },
  paginationInfo: {
    fontSize: '13px',
    color: '#a19f9d',
  },
})

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  return 'Just now'
}

export function Incidents() {
  const styles = useStyles()
  const { incidents } = useData()

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High': return styles.severityHigh
      case 'Medium': return styles.severityMedium
      case 'Low': return styles.severityLow
      default: return styles.severityInfo
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New': return styles.statusNew
      case 'Active': return styles.statusActive
      case 'Closed': return styles.statusClosed
      default: return ''
    }
  }

  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  )

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Incidents</h1>
        <Button appearance="primary">Create incident</Button>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.searchBox}
          placeholder="Search incidents..."
          contentBefore={<Search24Regular />}
        />
        <div className={styles.filterGroup}>
          <Dropdown placeholder="Severity" style={{ minWidth: '120px' }}>
            <Option>All</Option>
            <Option>High</Option>
            <Option>Medium</Option>
            <Option>Low</Option>
            <Option>Informational</Option>
          </Dropdown>
          <Dropdown placeholder="Status" style={{ minWidth: '120px' }}>
            <Option>All</Option>
            <Option>New</Option>
            <Option>Active</Option>
            <Option>Closed</Option>
          </Dropdown>
          <Dropdown placeholder="Owner" style={{ minWidth: '150px' }}>
            <Option>All</Option>
            <Option>Assigned to me</Option>
            <Option>Unassigned</Option>
          </Dropdown>
        </div>
        <Button icon={<ArrowSync24Regular />} appearance="subtle">Refresh</Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}></div>
          <div className={styles.tableHeaderCell}>Severity</div>
          <div className={styles.tableHeaderCell}>Title</div>
          <div className={styles.tableHeaderCell}>Status</div>
          <div className={styles.tableHeaderCell}>Alerts</div>
          <div className={styles.tableHeaderCell}>Owner</div>
          <div className={styles.tableHeaderCell}>Created</div>
        </div>

        {sortedIncidents.map((incident) => (
          <div key={incident.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <input type="checkbox" className={styles.checkbox} />
            </div>
            <div className={styles.tableCell}>
              <span className={`${styles.severityBadge} ${getSeverityStyle(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div>
                <span className={styles.incidentId}>{incident.id}</span>
                <span className={styles.incidentTitle}> - {incident.title}</span>
              </div>
            </div>
            <div className={styles.tableCell}>
              <span className={`${styles.statusBadge} ${getStatusStyle(incident.status)}`}>
                {incident.status}
              </span>
            </div>
            <div className={styles.tableCell}>{incident.alertCount}</div>
            <div className={styles.tableCell}>{incident.owner || 'Unassigned'}</div>
            <div className={styles.tableCell}>{formatTimeAgo(incident.createdTime)}</div>
          </div>
        ))}

        {sortedIncidents.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#a19f9d' }}>
            No incidents to display
          </div>
        )}
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>Showing 1-{sortedIncidents.length} of {incidents.length} incidents</div>
        <div className={styles.filterGroup}>
          <Button appearance="subtle" disabled>Previous</Button>
          <Button appearance="subtle">Next</Button>
        </div>
      </div>
    </div>
  )
}
