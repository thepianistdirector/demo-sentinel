import { makeStyles, Button, Input } from '@fluentui/react-components'
import { Search24Regular, Add24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  toolbar: { display: 'flex', gap: '12px' },
  searchBox: { width: '300px' },
  table: { backgroundColor: '#252423', borderRadius: '4px', border: '1px solid #323130', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 150px 150px 150px', gap: '12px', padding: '12px 16px', backgroundColor: '#1b1a19', borderBottom: '1px solid #323130' },
  tableHeaderCell: { fontSize: '12px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 150px 150px 150px', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #323130', ':hover': { backgroundColor: '#1b1a19' } },
  tableCell: { fontSize: '14px', color: '#d2d0ce' },
  watchlistName: { color: '#0078d4', cursor: 'pointer', ':hover': { textDecoration: 'underline' } },
})

const watchlists = [
  { name: 'VIP Users', items: 45, source: 'Local file', updated: '1 day ago' },
  { name: 'High Risk IPs', items: 1250, source: 'Azure Blob', updated: '2 hours ago' },
  { name: 'Sensitive Servers', items: 28, source: 'Local file', updated: '1 week ago' },
  { name: 'Terminated Employees', items: 156, source: 'Azure Blob', updated: '3 days ago' },
  { name: 'Known Bad Domains', items: 5420, source: 'External feed', updated: '1 hour ago' },
]

export function Watchlists() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Watchlists</h1>
        <div className={styles.toolbar}>
          <Input className={styles.searchBox} placeholder="Search watchlists..." contentBefore={<Search24Regular />} />
          <Button appearance="primary" icon={<Add24Regular />}>New watchlist</Button>
        </div>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Name</div>
          <div className={styles.tableHeaderCell}>Items</div>
          <div className={styles.tableHeaderCell}>Source</div>
          <div className={styles.tableHeaderCell}>Last updated</div>
        </div>
        {watchlists.map((wl, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.tableCell}><span className={styles.watchlistName}>{wl.name}</span></div>
            <div className={styles.tableCell}>{wl.items.toLocaleString()}</div>
            <div className={styles.tableCell}>{wl.source}</div>
            <div className={styles.tableCell}>{wl.updated}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
