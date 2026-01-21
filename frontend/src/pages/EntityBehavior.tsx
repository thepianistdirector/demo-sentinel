import { makeStyles, Input } from '@fluentui/react-components'
import { Search24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  searchBox: { width: '300px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '20px' },
  entityHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0078d4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '18px' },
  entityName: { fontSize: '16px', fontWeight: 600, color: '#ffffff' },
  entityType: { fontSize: '13px', color: '#a19f9d' },
  riskScore: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  riskLabel: { fontSize: '13px', color: '#a19f9d' },
  riskValue: { fontSize: '24px', fontWeight: 600 },
  riskHigh: { color: '#f87c7c' },
  riskMedium: { color: '#ffd335' },
  riskLow: { color: '#6ccb5f' },
  activityList: { borderTop: '1px solid #323130', paddingTop: '12px' },
  activityItem: { fontSize: '13px', color: '#a19f9d', padding: '4px 0' },
})

const entities = [
  { name: 'john.doe@contoso.com', type: 'User', initials: 'JD', risk: 85, activities: ['3 failed logins', '1 suspicious IP', 'New device'] },
  { name: 'DC-01.contoso.com', type: 'Host', initials: 'DC', risk: 45, activities: ['Admin login', 'Service restart', 'Config change'] },
  { name: '192.168.1.100', type: 'IP Address', initials: 'IP', risk: 72, activities: ['Port scan detected', 'Multiple connections', 'Unusual traffic'] },
  { name: 'jane.smith@contoso.com', type: 'User', initials: 'JS', risk: 12, activities: ['Normal activity', 'Password changed'] },
  { name: 'SRV-APP-01', type: 'Host', initials: 'SA', risk: 28, activities: ['High CPU usage', 'Memory alert'] },
  { name: 'admin@contoso.com', type: 'User', initials: 'AD', risk: 65, activities: ['After-hours login', 'Privilege escalation'] },
]

export function EntityBehavior() {
  const styles = useStyles()
  const getRiskStyle = (risk: number) => risk >= 70 ? styles.riskHigh : risk >= 40 ? styles.riskMedium : styles.riskLow

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Entity behavior</h1>
        <Input className={styles.searchBox} placeholder="Search entities..." contentBefore={<Search24Regular />} />
      </div>
      <div className={styles.grid}>
        {entities.map((entity, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.entityHeader}>
              <div className={styles.avatar}>{entity.initials}</div>
              <div>
                <div className={styles.entityName}>{entity.name}</div>
                <div className={styles.entityType}>{entity.type}</div>
              </div>
            </div>
            <div className={styles.riskScore}>
              <span className={styles.riskLabel}>Risk Score:</span>
              <span className={`${styles.riskValue} ${getRiskStyle(entity.risk)}`}>{entity.risk}</span>
            </div>
            <div className={styles.activityList}>
              {entity.activities.map((activity, j) => (
                <div key={j} className={styles.activityItem}>• {activity}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
