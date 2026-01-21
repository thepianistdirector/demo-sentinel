import { makeStyles } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '24px' },
  title: { color: '#ffffff', fontSize: '28px', fontWeight: 600 },
  description: { fontSize: '14px', color: '#a19f9d' },
  matrix: { backgroundColor: '#252423', border: '1px solid #323130', borderRadius: '8px', padding: '20px', overflowX: 'auto' },
  tacticRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
  tacticHeader: { minWidth: '140px', padding: '8px 12px', backgroundColor: '#0078d4', borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: '#ffffff', textAlign: 'center' },
  techniqueCell: { minWidth: '140px', padding: '8px 12px', backgroundColor: '#1b1a19', borderRadius: '4px', fontSize: '11px', color: '#d2d0ce', border: '1px solid #323130' },
  techniqueActive: { backgroundColor: '#442726', borderColor: '#f87c7c' },
  legend: { display: 'flex', gap: '24px', marginTop: '16px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#a19f9d' },
  legendBox: { width: '16px', height: '16px', borderRadius: '4px' },
})

const tactics = [
  { name: 'Initial Access', techniques: [{ name: 'Phishing', active: true }, { name: 'Valid Accounts', active: true }] },
  { name: 'Execution', techniques: [{ name: 'PowerShell', active: true }, { name: 'Command Line', active: false }] },
  { name: 'Persistence', techniques: [{ name: 'Registry Keys', active: false }, { name: 'Scheduled Task', active: true }] },
  { name: 'Privilege Esc', techniques: [{ name: 'Token Manipulation', active: false }, { name: 'Sudo', active: false }] },
  { name: 'Defense Evasion', techniques: [{ name: 'Obfuscation', active: true }, { name: 'Rootkit', active: false }] },
  { name: 'Credential Access', techniques: [{ name: 'Brute Force', active: true }, { name: 'Credential Dump', active: true }] },
  { name: 'Lateral Movement', techniques: [{ name: 'Remote Services', active: true }, { name: 'Pass the Hash', active: false }] },
  { name: 'Exfiltration', techniques: [{ name: 'Data Transfer', active: true }, { name: 'C2 Channel', active: false }] },
]

export function MitreAttack() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>MITRE ATT&CK</h1>
      <p className={styles.description}>Coverage of MITRE ATT&CK tactics and techniques based on your enabled analytics rules.</p>
      <div className={styles.matrix}>
        {tactics.map((tactic, i) => (
          <div key={i} className={styles.tacticRow}>
            <div className={styles.tacticHeader}>{tactic.name}</div>
            {tactic.techniques.map((tech, j) => (
              <div key={j} className={`${styles.techniqueCell} ${tech.active ? styles.techniqueActive : ''}`}>{tech.name}</div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}><div className={styles.legendBox} style={{ backgroundColor: '#442726', border: '1px solid #f87c7c' }} />Covered by rules</div>
        <div className={styles.legendItem}><div className={styles.legendBox} style={{ backgroundColor: '#1b1a19', border: '1px solid #323130' }} />Not covered</div>
      </div>
    </div>
  )
}
