import { makeStyles, Button, Dropdown, Option } from '@fluentui/react-components'
import {
  Play24Regular,
  Clock24Regular,
  Save24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons'
import { useData } from '../contexts/DataContext'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '16px',
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
  querySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  toolbarRight: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editorContainer: {
    backgroundColor: '#1e1e1e',
    border: '1px solid #323130',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#252423',
    borderBottom: '1px solid #323130',
  },
  editorTabs: {
    display: 'flex',
    gap: '4px',
  },
  editorTab: {
    padding: '4px 12px',
    fontSize: '13px',
    color: '#a19f9d',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
  },
  editorTabActive: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
  },
  editor: {
    minHeight: '200px',
    padding: '12px',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '14px',
    color: '#d4d4d4',
    lineHeight: '1.5',
  },
  keyword: {
    color: '#569cd6',
  },
  operator: {
    color: '#d4d4d4',
  },
  function: {
    color: '#dcdcaa',
  },
  number: {
    color: '#b5cea8',
  },
  resultsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#252423',
    borderBottom: '1px solid #323130',
  },
  resultsInfo: {
    fontSize: '13px',
    color: '#a19f9d',
  },
  resultsTable: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#1b1a19',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '180px 120px 200px 150px 1fr',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#252423',
    borderBottom: '1px solid #323130',
    position: 'sticky',
    top: 0,
  },
  tableHeaderCell: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a19f9d',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '180px 120px 200px 150px 1fr',
    gap: '12px',
    padding: '10px 16px',
    borderBottom: '1px solid #323130',
  },
  tableCell: {
    fontSize: '13px',
    color: '#d2d0ce',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  schemaSidebar: {
    width: '240px',
    backgroundColor: '#252423',
    borderLeft: '1px solid #323130',
    padding: '12px',
    overflowY: 'auto',
  },
  schemaTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '12px',
  },
  schemaTable: {
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#d2d0ce',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    gap: '0',
    overflow: 'hidden',
  },
  queryAndResults: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
})

const tables = [
  'SecurityEvent',
  'SigninLogs',
  'AzureActivity',
  'Syslog',
  'CommonSecurityLog',
  'OfficeActivity',
  'AzureDiagnostics',
  'Heartbeat',
]

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

export function Logs() {
  const styles = useStyles()
  const { securityEvents } = useData()

  // Sort events by time, most recent first
  const sortedEvents = [...securityEvents]
    .sort((a, b) => new Date(b.timeGenerated).getTime() - new Date(a.timeGenerated).getTime())
    .slice(0, 100) // Limit to 100 for display

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Logs</h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.queryAndResults}>
          {/* Query Editor */}
          <div className={styles.querySection}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <Button appearance="primary" icon={<Play24Regular />}>Run</Button>
                <Dropdown placeholder="Time range" style={{ minWidth: '150px' }}>
                  <Option>Last 24 hours</Option>
                  <Option>Last 7 days</Option>
                  <Option>Last 30 days</Option>
                  <Option>Custom</Option>
                </Dropdown>
              </div>
              <div className={styles.toolbarRight}>
                <Button appearance="subtle" icon={<Save24Regular />}>Save</Button>
                <Button appearance="subtle" icon={<Clock24Regular />}>Query history</Button>
                <Button appearance="subtle" icon={<ArrowDownload24Regular />}>Export</Button>
              </div>
            </div>

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <div className={styles.editorTabs}>
                  <button className={`${styles.editorTab} ${styles.editorTabActive}`}>Query 1</button>
                  <button className={styles.editorTab}>+ New query</button>
                </div>
              </div>
              <div className={styles.editor}>
                <code>
                  <span className={styles.keyword}>SecurityEvent</span>
                  <br />
                  <span className={styles.operator}>| </span>
                  <span className={styles.keyword}>where</span>
                  <span> TimeGenerated </span>
                  <span className={styles.operator}>&gt;</span>
                  <span> </span>
                  <span className={styles.function}>ago</span>
                  <span>(</span>
                  <span className={styles.number}>24h</span>
                  <span>)</span>
                  <br />
                  <span className={styles.operator}>| </span>
                  <span className={styles.keyword}>where</span>
                  <span> EventID </span>
                  <span className={styles.operator}>==</span>
                  <span> </span>
                  <span className={styles.number}>4625</span>
                  <br />
                  <span className={styles.operator}>| </span>
                  <span className={styles.keyword}>summarize</span>
                  <span> </span>
                  <span className={styles.function}>count</span>
                  <span>() </span>
                  <span className={styles.keyword}>by</span>
                  <span> Account, Computer</span>
                  <br />
                  <span className={styles.operator}>| </span>
                  <span className={styles.keyword}>order by</span>
                  <span> count_ </span>
                  <span className={styles.keyword}>desc</span>
                  <br />
                  <span className={styles.operator}>| </span>
                  <span className={styles.keyword}>take</span>
                  <span> </span>
                  <span className={styles.number}>100</span>
                </code>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                Results: {sortedEvents.length} rows returned
              </div>
              <div className={styles.toolbarRight}>
                <Button appearance="subtle" size="small">Columns</Button>
                <Button appearance="subtle" size="small" icon={<ArrowDownload24Regular />}>Export</Button>
              </div>
            </div>

            <div className={styles.resultsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>TimeGenerated</div>
                <div className={styles.tableHeaderCell}>EventID</div>
                <div className={styles.tableHeaderCell}>Computer</div>
                <div className={styles.tableHeaderCell}>Account</div>
                <div className={styles.tableHeaderCell}>Activity</div>
              </div>

              {sortedEvents.map((event) => (
                <div key={event.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>{formatTimestamp(event.timeGenerated)}</div>
                  <div className={styles.tableCell}>{event.eventID}</div>
                  <div className={styles.tableCell}>{event.computer}</div>
                  <div className={styles.tableCell}>{event.account}</div>
                  <div className={styles.tableCell}>{event.activity}</div>
                </div>
              ))}

              {sortedEvents.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#a19f9d' }}>
                  No log entries to display. Run a query to see results.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schema Sidebar */}
        <div className={styles.schemaSidebar}>
          <div className={styles.schemaTitle}>Tables</div>
          {tables.map((table) => (
            <div key={table} className={styles.schemaTable}>
              {table}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
