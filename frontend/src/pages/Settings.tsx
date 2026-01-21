import { makeStyles } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  section: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #323130' },
  label: { fontSize: '14px', color: '#a19f9d' },
  value: { fontSize: '14px', color: '#ffffff' },
})

export function Settings() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Workspace Information</div>
        <div className={styles.row}><span className={styles.label}>Workspace Name</span><span className={styles.value}>Demo-Workspace</span></div>
        <div className={styles.row}><span className={styles.label}>Subscription</span><span className={styles.value}>Demo-Subscription</span></div>
        <div className={styles.row}><span className={styles.label}>Resource Group</span><span className={styles.value}>rg-sentinel-demo</span></div>
        <div className={styles.row}><span className={styles.label}>Location</span><span className={styles.value}>East US</span></div>
        <div className={styles.row}><span className={styles.label}>Pricing Tier</span><span className={styles.value}>Pay-As-You-Go</span></div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Data Retention</div>
        <div className={styles.row}><span className={styles.label}>Interactive Retention</span><span className={styles.value}>90 days</span></div>
        <div className={styles.row}><span className={styles.label}>Total Retention</span><span className={styles.value}>2 years</span></div>
        <div className={styles.row}><span className={styles.label}>Daily Ingestion Cap</span><span className={styles.value}>No cap</span></div>
      </div>
    </div>
  )
}
