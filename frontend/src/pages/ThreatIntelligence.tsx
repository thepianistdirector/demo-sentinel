import { makeStyles, Button, Input } from '@fluentui/react-components'
import { Search24Regular, Add24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  toolbar: { display: 'flex', gap: '12px' },
  searchBox: { width: '300px' },
  stats: { display: 'flex', gap: '24px', padding: '16px', backgroundColor: '#252423', borderRadius: '4px', border: '1px solid #323130' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statValue: { fontSize: '24px', fontWeight: 600, color: '#ffffff' },
  statLabel: { fontSize: '13px', color: '#a19f9d' },
  table: { backgroundColor: '#252423', borderRadius: '4px', border: '1px solid #323130', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 120px 150px 120px 150px', gap: '12px', padding: '12px 16px', backgroundColor: '#1b1a19', borderBottom: '1px solid #323130' },
  tableHeaderCell: { fontSize: '12px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 120px 150px 120px 150px', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #323130', ':hover': { backgroundColor: '#1b1a19' } },
  tableCell: { fontSize: '14px', color: '#d2d0ce' },
  iocValue: { fontFamily: 'monospace', color: '#0078d4' },
  typeBadge: { padding: '2px 8px', backgroundColor: '#323130', borderRadius: '4px', fontSize: '12px', color: '#a19f9d' },
  confidenceBadge: { padding: '2px 8px', borderRadius: '4px', fontSize: '12px' },
  confHigh: { backgroundColor: '#1e3a29', color: '#6ccb5f' },
  confMedium: { backgroundColor: '#433519', color: '#ffd335' },
  confLow: { backgroundColor: '#442726', color: '#f87c7c' },
})

const indicators = [
  { value: '192.168.1.100', type: 'IP', source: 'Microsoft TI', confidence: 'High', lastSeen: '2 hours ago' },
  { value: 'malware.bad.com', type: 'Domain', source: 'AlienVault', confidence: 'High', lastSeen: '1 day ago' },
  { value: 'a1b2c3d4e5f6...', type: 'File Hash', source: 'VirusTotal', confidence: 'Medium', lastSeen: '3 hours ago' },
  { value: 'phishing@evil.com', type: 'Email', source: 'Internal', confidence: 'High', lastSeen: '6 hours ago' },
  { value: '10.0.0.50', type: 'IP', source: 'Crowdstrike', confidence: 'Low', lastSeen: '2 days ago' },
  { value: 'c2server.net', type: 'Domain', source: 'Microsoft TI', confidence: 'High', lastSeen: '4 hours ago' },
]

export function ThreatIntelligence() {
  const styles = useStyles()
  const getConfStyle = (conf: string) => conf === 'High' ? styles.confHigh : conf === 'Medium' ? styles.confMedium : styles.confLow

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Threat intelligence</h1>
        <div className={styles.toolbar}>
          <Input className={styles.searchBox} placeholder="Search indicators..." contentBefore={<Search24Regular />} />
          <Button appearance="primary" icon={<Add24Regular />}>Add indicator</Button>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}><span className={styles.statValue}>1,247</span><span className={styles.statLabel}>Total indicators</span></div>
        <div className={styles.statItem}><span className={styles.statValue}>89</span><span className={styles.statLabel}>Matched alerts</span></div>
        <div className={styles.statItem}><span className={styles.statValue}>12</span><span className={styles.statLabel}>Sources</span></div>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Indicator</div>
          <div className={styles.tableHeaderCell}>Type</div>
          <div className={styles.tableHeaderCell}>Source</div>
          <div className={styles.tableHeaderCell}>Confidence</div>
          <div className={styles.tableHeaderCell}>Last seen</div>
        </div>
        {indicators.map((ind, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={`${styles.tableCell} ${styles.iocValue}`}>{ind.value}</div>
            <div className={styles.tableCell}><span className={styles.typeBadge}>{ind.type}</span></div>
            <div className={styles.tableCell}>{ind.source}</div>
            <div className={styles.tableCell}><span className={`${styles.confidenceBadge} ${getConfStyle(ind.confidence)}`}>{ind.confidence}</span></div>
            <div className={styles.tableCell}>{ind.lastSeen}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
