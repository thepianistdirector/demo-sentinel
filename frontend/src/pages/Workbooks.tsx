import { makeStyles, Button, Input } from '@fluentui/react-components'
import { Search24Regular, Add24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  toolbar: { display: 'flex', gap: '12px', alignItems: 'center' },
  searchBox: { width: '300px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '20px', cursor: 'pointer', ':hover': { borderColor: '#0078d4' } },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' },
  cardDescription: { fontSize: '13px', color: '#a19f9d', lineHeight: '1.5' },
  cardMeta: { marginTop: '12px', fontSize: '12px', color: '#605e5c' },
})

const workbooks = [
  { name: 'Security Operations', description: 'Overview of security incidents and alerts', lastModified: '2 days ago' },
  { name: 'Identity & Access', description: 'Azure AD sign-in and audit analysis', lastModified: '1 week ago' },
  { name: 'Network Security', description: 'Firewall and network traffic analysis', lastModified: '3 days ago' },
  { name: 'Threat Intelligence', description: 'IOC matching and threat indicators', lastModified: '5 days ago' },
  { name: 'Compliance Dashboard', description: 'Regulatory compliance status', lastModified: '1 day ago' },
  { name: 'Investigation Insights', description: 'Deep-dive investigation tools', lastModified: '4 days ago' },
]

export function Workbooks() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Workbooks</h1>
        <div className={styles.toolbar}>
          <Input className={styles.searchBox} placeholder="Search workbooks..." contentBefore={<Search24Regular />} />
          <Button appearance="primary" icon={<Add24Regular />}>New workbook</Button>
        </div>
      </div>
      <div className={styles.grid}>
        {workbooks.map((wb, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardTitle}>{wb.name}</div>
            <div className={styles.cardDescription}>{wb.description}</div>
            <div className={styles.cardMeta}>Last modified: {wb.lastModified}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
