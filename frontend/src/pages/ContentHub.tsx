import { makeStyles, Button, Input } from '@fluentui/react-components'
import { Search24Regular, Checkmark24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  searchBox: { width: '300px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '20px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  cardIcon: { width: '40px', height: '40px', backgroundColor: '#0078d4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: '#ffffff' },
  cardDescription: { fontSize: '13px', color: '#a19f9d', lineHeight: '1.5', marginBottom: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #323130' },
  installedBadge: { display: 'flex', alignItems: 'center', gap: '4px', color: '#6ccb5f', fontSize: '13px' },
  typeBadge: { padding: '2px 8px', backgroundColor: '#323130', borderRadius: '4px', fontSize: '12px', color: '#a19f9d' },
})

const solutions = [
  { name: 'Microsoft Defender XDR', icon: 'MD', description: 'Get alerts and incidents from Microsoft Defender suite.', type: 'Solution', installed: true },
  { name: 'Azure Active Directory', icon: 'AD', description: 'Identity protection and sign-in analytics.', type: 'Solution', installed: true },
  { name: 'Microsoft 365', icon: '365', description: 'Office 365 activity monitoring and threat detection.', type: 'Solution', installed: true },
  { name: 'Palo Alto Networks', icon: 'PA', description: 'Firewall and network security integration.', type: 'Solution', installed: false },
  { name: 'AWS', icon: 'AWS', description: 'Amazon Web Services security monitoring.', type: 'Solution', installed: false },
  { name: 'UEBA', icon: 'UE', description: 'User and Entity Behavior Analytics.', type: 'Solution', installed: true },
]

export function ContentHub() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Content hub</h1>
        <Input className={styles.searchBox} placeholder="Search content..." contentBefore={<Search24Regular />} />
      </div>
      <div className={styles.grid}>
        {solutions.map((sol, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{sol.icon}</div>
              <div className={styles.cardTitle}>{sol.name}</div>
            </div>
            <div className={styles.cardDescription}>{sol.description}</div>
            <div className={styles.cardFooter}>
              <span className={styles.typeBadge}>{sol.type}</span>
              {sol.installed ? (
                <span className={styles.installedBadge}><Checkmark24Regular /> Installed</span>
              ) : (
                <Button size="small">Install</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
