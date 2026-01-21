import { makeStyles, Button, Input, Switch } from '@fluentui/react-components'
import { Search24Regular, Add24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  toolbar: { display: 'flex', gap: '12px' },
  searchBox: { width: '300px' },
  table: { backgroundColor: '#252423', borderRadius: '4px', border: '1px solid #323130', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '60px 1fr 150px 120px 150px', gap: '12px', padding: '12px 16px', backgroundColor: '#1b1a19', borderBottom: '1px solid #323130' },
  tableHeaderCell: { fontSize: '12px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase' },
  tableRow: { display: 'grid', gridTemplateColumns: '60px 1fr 150px 120px 150px', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #323130', ':hover': { backgroundColor: '#1b1a19' } },
  tableCell: { fontSize: '14px', color: '#d2d0ce', display: 'flex', alignItems: 'center' },
  playbookName: { color: '#0078d4', cursor: 'pointer', ':hover': { textDecoration: 'underline' } },
  triggerBadge: { padding: '2px 8px', backgroundColor: '#323130', borderRadius: '4px', fontSize: '12px', color: '#a19f9d' },
})

const playbooks = [
  { name: 'Isolate compromised host', enabled: true, trigger: 'Incident', runs: 45, lastRun: '2 hours ago' },
  { name: 'Block malicious IP', enabled: true, trigger: 'Alert', runs: 128, lastRun: '30 minutes ago' },
  { name: 'Send Teams notification', enabled: true, trigger: 'Incident', runs: 312, lastRun: '1 hour ago' },
  { name: 'Enrich IOC with TI', enabled: true, trigger: 'Alert', runs: 89, lastRun: '4 hours ago' },
  { name: 'Create ServiceNow ticket', enabled: false, trigger: 'Incident', runs: 23, lastRun: '1 week ago' },
  { name: 'Disable compromised user', enabled: true, trigger: 'Alert', runs: 12, lastRun: '1 day ago' },
]

export function Automation() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Automation</h1>
        <div className={styles.toolbar}>
          <Input className={styles.searchBox} placeholder="Search playbooks..." contentBefore={<Search24Regular />} />
          <Button appearance="primary" icon={<Add24Regular />}>Create playbook</Button>
        </div>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Status</div>
          <div className={styles.tableHeaderCell}>Playbook name</div>
          <div className={styles.tableHeaderCell}>Trigger</div>
          <div className={styles.tableHeaderCell}>Total runs</div>
          <div className={styles.tableHeaderCell}>Last run</div>
        </div>
        {playbooks.map((pb, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.tableCell}><Switch checked={pb.enabled} /></div>
            <div className={styles.tableCell}><span className={styles.playbookName}>{pb.name}</span></div>
            <div className={styles.tableCell}><span className={styles.triggerBadge}>{pb.trigger}</span></div>
            <div className={styles.tableCell}>{pb.runs}</div>
            <div className={styles.tableCell}>{pb.lastRun}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
