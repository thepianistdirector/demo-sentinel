import { useState } from 'react'
import { makeStyles, Button, Dropdown, Option, Tab, TabList } from '@fluentui/react-components'
import {
  Play24Regular,
  Clock24Regular,
  Save24Regular,
  ArrowDownload24Regular,
  Settings24Regular,
} from '@fluentui/react-icons'

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
    ':hover': {
      backgroundColor: '#323130',
    },
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
  lineNumbers: {
    color: '#858585',
    userSelect: 'none',
    paddingRight: '12px',
    borderRight: '1px solid #323130',
    marginRight: '12px',
  },
  keyword: {
    color: '#569cd6',
  },
  string: {
    color: '#ce9178',
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
    ':hover': {
      backgroundColor: '#252423',
    },
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
    ':hover': {
      backgroundColor: '#323130',
    },
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

const mockResults = [
  { timestamp: '2024-01-15 14:32:15', level: 'Warning', computer: 'WS-PC-001.contoso.com', account: 'john.doe@contoso.com', message: 'Failed login attempt detected' },
  { timestamp: '2024-01-15 14:31:42', level: 'Error', computer: 'DC-01.contoso.com', account: 'admin@contoso.com', message: 'Account lockout triggered' },
  { timestamp: '2024-01-15 14:30:18', level: 'Information', computer: 'WS-PC-002.contoso.com', account: 'jane.smith@contoso.com', message: 'Successful authentication' },
  { timestamp: '2024-01-15 14:29:55', level: 'Warning', computer: 'SRV-APP-01.contoso.com', account: 'service_account', message: 'Certificate expiring soon' },
  { timestamp: '2024-01-15 14:28:33', level: 'Error', computer: 'WS-PC-003.contoso.com', account: 'mike.wilson@contoso.com', message: 'Malware detected and quarantined' },
  { timestamp: '2024-01-15 14:27:12', level: 'Information', computer: 'DC-02.contoso.com', account: 'SYSTEM', message: 'Group policy applied successfully' },
]

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

export function Logs() {
  const styles = useStyles()

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
                Results: 6 rows returned in 0.234s
              </div>
              <div className={styles.toolbarRight}>
                <Button appearance="subtle" size="small">Columns</Button>
                <Button appearance="subtle" size="small" icon={<ArrowDownload24Regular />}>Export</Button>
              </div>
            </div>

            <div className={styles.resultsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>TimeGenerated</div>
                <div className={styles.tableHeaderCell}>Level</div>
                <div className={styles.tableHeaderCell}>Computer</div>
                <div className={styles.tableHeaderCell}>Account</div>
                <div className={styles.tableHeaderCell}>Message</div>
              </div>

              {mockResults.map((row, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.tableCell}>{row.timestamp}</div>
                  <div className={styles.tableCell}>{row.level}</div>
                  <div className={styles.tableCell}>{row.computer}</div>
                  <div className={styles.tableCell}>{row.account}</div>
                  <div className={styles.tableCell}>{row.message}</div>
                </div>
              ))}
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
