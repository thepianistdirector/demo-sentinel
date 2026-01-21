import { makeStyles, Button, Input, Tab, TabList } from '@fluentui/react-components'
import { Search24Regular, Play24Regular, BookmarkAdd24Regular } from '@fluentui/react-icons'

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
  tabs: {
    borderBottom: '1px solid #323130',
    marginBottom: '16px',
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchBox: {
    width: '300px',
  },
  queryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '16px',
  },
  queryCard: {
    backgroundColor: '#252423',
    border: '1px solid #323130',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  queryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  queryName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0078d4',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  queryActions: {
    display: 'flex',
    gap: '8px',
  },
  queryDescription: {
    fontSize: '13px',
    color: '#a19f9d',
    lineHeight: '1.5',
  },
  queryMeta: {
    display: 'flex',
    gap: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #323130',
    fontSize: '12px',
    color: '#605e5c',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  tacticBadge: {
    padding: '2px 6px',
    backgroundColor: '#323130',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#a19f9d',
  },
})

const queries = [
  { name: 'Failed Logon Attempts', description: 'Identifies failed logon attempts across the environment.', tactics: ['Initial Access', 'Credential Access'], dataSource: 'SecurityEvent', results: 156 },
  { name: 'Suspicious PowerShell Commands', description: 'Detects potentially malicious PowerShell commands.', tactics: ['Execution', 'Defense Evasion'], dataSource: 'SecurityEvent', results: 23 },
  { name: 'Unusual Network Connections', description: 'Identifies network connections to unusual destinations.', tactics: ['Command and Control'], dataSource: 'CommonSecurityLog', results: 45 },
  { name: 'New Admin Account Created', description: 'Alerts when a new administrator account is created.', tactics: ['Persistence'], dataSource: 'SecurityEvent', results: 3 },
  { name: 'Lateral Movement Detection', description: 'Detects potential lateral movement techniques.', tactics: ['Lateral Movement'], dataSource: 'SecurityEvent', results: 12 },
  { name: 'Data Exfiltration Indicators', description: 'Identifies large data transfers or suspicious endpoints.', tactics: ['Exfiltration'], dataSource: 'CommonSecurityLog', results: 8 },
]

export function Hunting() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hunting</h1>
        <div className={styles.toolbar}>
          <Input className={styles.searchBox} placeholder="Search queries..." contentBefore={<Search24Regular />} />
          <Button appearance="primary">New query</Button>
        </div>
      </div>

      <div className={styles.tabs}>
        <TabList defaultSelectedValue="queries">
          <Tab value="queries">Queries</Tab>
          <Tab value="bookmarks">Bookmarks</Tab>
          <Tab value="livestream">Livestream</Tab>
        </TabList>
      </div>

      <div className={styles.queryGrid}>
        {queries.map((query, index) => (
          <div key={index} className={styles.queryCard}>
            <div className={styles.queryHeader}>
              <span className={styles.queryName}>{query.name}</span>
              <div className={styles.queryActions}>
                <Button appearance="subtle" size="small" icon={<Play24Regular />}>Run</Button>
                <Button appearance="subtle" size="small" icon={<BookmarkAdd24Regular />} />
              </div>
            </div>
            <div className={styles.queryDescription}>{query.description}</div>
            <div>
              {query.tactics.map((tactic, i) => (
                <span key={i} className={styles.tacticBadge} style={{ marginRight: '4px' }}>{tactic}</span>
              ))}
            </div>
            <div className={styles.queryMeta}>
              <div className={styles.metaItem}><span>Data source:</span><span style={{ color: '#a19f9d' }}>{query.dataSource}</span></div>
              <div className={styles.metaItem}><span>Results:</span><span style={{ color: '#a19f9d' }}>{query.results}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
