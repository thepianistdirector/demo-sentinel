import { makeStyles, Button } from '@fluentui/react-components'
import { Add24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  emptyState: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '60px', textAlign: 'center' },
  emptyTitle: { fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' },
  emptyDescription: { fontSize: '14px', color: '#a19f9d', marginBottom: '24px' },
})

export function Notebooks() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notebooks</h1>
        <Button appearance="primary" icon={<Add24Regular />}>New notebook</Button>
      </div>
      <div className={styles.emptyState}>
        <div className={styles.emptyTitle}>No notebooks yet</div>
        <div className={styles.emptyDescription}>Create Jupyter notebooks to investigate threats and analyze data with Python.</div>
        <Button appearance="primary" icon={<Add24Regular />}>Create your first notebook</Button>
      </div>
    </div>
  )
}
