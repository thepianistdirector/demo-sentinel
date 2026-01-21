import { makeStyles, Button, Input, Switch } from '@fluentui/react-components'
import { Search24Regular, Add24Regular } from '@fluentui/react-icons'

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
  table: {
    backgroundColor: '#252423',
    borderRadius: '4px',
    border: '1px solid #323130',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 150px 150px 100px',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#1b1a19',
    borderBottom: '1px solid #323130',
  },
  tableHeaderCell: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a19f9d',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 150px 150px 100px',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #323130',
    ':hover': {
      backgroundColor: '#1b1a19',
    },
  },
  tableCell: {
    fontSize: '14px',
    color: '#d2d0ce',
    display: 'flex',
    alignItems: 'center',
  },
  ruleName: {
    color: '#0078d4',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
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
  mitreBadge: {
    padding: '2px 6px',
    backgroundColor: '#323130',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#a19f9d',
    marginRight: '4px',
  },
})

const rules = [
  { name: 'Suspicious login from unknown location', severity: 'high', status: true, mitre: ['T1078', 'T1110'], lastTriggered: '2 hours ago', alerts: 12 },
  { name: 'Multiple failed authentication attempts', severity: 'high', status: true, mitre: ['T1110'], lastTriggered: '4 hours ago', alerts: 8 },
  { name: 'Anomalous network traffic detected', severity: 'medium', status: true, mitre: ['T1071', 'T1095'], lastTriggered: '1 day ago', alerts: 3 },
  { name: 'New device enrolled in network', severity: 'low', status: true, mitre: ['T1200'], lastTriggered: '2 days ago', alerts: 15 },
  { name: 'Potential ransomware activity', severity: 'high', status: true, mitre: ['T1486'], lastTriggered: '3 days ago', alerts: 2 },
  { name: 'Unusual outbound data transfer', severity: 'medium', status: false, mitre: ['T1048'], lastTriggered: 'Never', alerts: 0 },
  { name: 'Deprecated TLS version in use', severity: 'low', status: true, mitre: ['T1573'], lastTriggered: '1 week ago', alerts: 5 },
  { name: 'Admin account created', severity: 'medium', status: true, mitre: ['T1136'], lastTriggered: '5 days ago', alerts: 1 },
]

export function Analytics() {
  const styles = useStyles()

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high': return styles.severityHigh
      case 'medium': return styles.severityMedium
      default: return styles.severityLow
    }
  }

  const enabledCount = rules.filter(r => r.status).length

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <div className={styles.toolbar}>
          <Input
            className={styles.searchBox}
            placeholder="Search rules..."
            contentBefore={<Search24Regular />}
          />
          <Button appearance="primary" icon={<Add24Regular />}>Create rule</Button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{rules.length}</span>
          <span className={styles.statLabel}>Total rules</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{enabledCount}</span>
          <span className={styles.statLabel}>Enabled</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{rules.length - enabledCount}</span>
          <span className={styles.statLabel}>Disabled</span>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Status</div>
          <div className={styles.tableHeaderCell}>Name</div>
          <div className={styles.tableHeaderCell}>Severity</div>
          <div className={styles.tableHeaderCell}>MITRE ATT&CK</div>
          <div className={styles.tableHeaderCell}>Last triggered</div>
          <div className={styles.tableHeaderCell}>Alerts</div>
        </div>

        {rules.map((rule, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <Switch checked={rule.status} />
            </div>
            <div className={styles.tableCell}>
              <span className={styles.ruleName}>{rule.name}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={`${styles.severityBadge} ${getSeverityStyle(rule.severity)}`}>
                {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
              </span>
            </div>
            <div className={styles.tableCell}>
              {rule.mitre.map((tactic, i) => (
                <span key={i} className={styles.mitreBadge}>{tactic}</span>
              ))}
            </div>
            <div className={styles.tableCell}>{rule.lastTriggered}</div>
            <div className={styles.tableCell}>{rule.alerts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
