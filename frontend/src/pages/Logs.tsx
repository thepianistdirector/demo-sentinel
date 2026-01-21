import { useState, useEffect, useCallback } from 'react'
import { makeStyles, Button, Dropdown, Option, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Spinner } from '@fluentui/react-components'
import {
  Play24Regular,
  Clock24Regular,
  Save24Regular,
  ArrowDownload24Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons'
import Editor from '@monaco-editor/react'
import { useData } from '../contexts/DataContext'
import { executeKql, registerTable } from '../services/kql'
import type { KqlValue } from '../services/kql'
import { precannedQueries, getAllCategories, getQueriesByCategory } from '../data/precannedQueries'
import type { PrecannedQuery } from '../data/precannedQueries'
import { useQueryHistory } from '../hooks/useQueryHistory'

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
    display: 'flex',
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
    minWidth: '120px',
    flex: 1,
  },
  tableRow: {
    display: 'flex',
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
    minWidth: '120px',
    flex: 1,
  },
  schemaSidebar: {
    width: '260px',
    backgroundColor: '#252423',
    borderLeft: '1px solid #323130',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  schemaSection: {
    padding: '12px',
    flex: 1,
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
  errorMessage: {
    padding: '16px',
    backgroundColor: '#442726',
    color: '#f1707a',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '8px',
  },
  queryCategory: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a19f9d',
    padding: '8px 12px 4px',
    textTransform: 'uppercase',
  },
  precannedQuery: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#d2d0ce',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  historyItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#d2d0ce',
    borderBottom: '1px solid #323130',
  },
  historyQuery: {
    fontFamily: 'Consolas, Monaco, monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '4px',
  },
  historyMeta: {
    fontSize: '11px',
    color: '#a19f9d',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #323130',
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
  },
  loadingOverlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    color: '#a19f9d',
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

const defaultQuery = `SecurityEvent
| where EventID == 4624 or EventID == 4625
| summarize count() by Account, EventID
| sort by count_ desc
| take 20`

function formatValue(value: KqlValue): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().replace('T', ' ').substring(0, 19)
  return String(value)
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export function Logs() {
  const styles = useStyles()
  const { securityEvents } = useData()
  const { history, addToHistory, clearHistory } = useQueryHistory()

  const [query, setQuery] = useState(defaultQuery)
  const [results, setResults] = useState<{ columns: string[]; rows: Record<string, KqlValue>[] }>({ columns: [], rows: [] })
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showQueries, setShowQueries] = useState(false)

  // Register the security events table when data changes
  useEffect(() => {
    if (securityEvents.length > 0) {
      // Convert SecurityEvent to generic records for KQL
      const records = securityEvents.map(e => ({
        id: e.id,
        TimeGenerated: e.timeGenerated,
        Computer: e.computer,
        Account: e.account,
        EventID: e.eventID,
        Activity: e.activity,
        LogonType: e.logonType ?? null,
        CommandLine: e.commandLine ?? null,
      }))
      registerTable('SecurityEvent', records)
    }
  }, [securityEvents])

  const runQuery = useCallback(() => {
    setIsRunning(true)
    setError(null)

    // Small delay to show loading state
    setTimeout(() => {
      const result = executeKql(query)

      if (result.error) {
        setError(result.error)
        setResults({ columns: [], rows: [] })
        addToHistory(query, undefined, result.error)
      } else {
        setResults({ columns: result.columns, rows: result.rows })
        addToHistory(query, result.rows.length)
      }

      setIsRunning(false)
    }, 100)
  }, [query, addToHistory])

  const handleSelectPrecannedQuery = (q: PrecannedQuery) => {
    setQuery(q.query)
    setShowQueries(false)
  }

  const handleSelectHistoryItem = (historyQuery: string) => {
    setQuery(historyQuery)
    setShowHistory(false)
  }

  const handleTableClick = (tableName: string) => {
    setQuery(`${tableName}\n| take 100`)
  }

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
                <Button
                  appearance="primary"
                  icon={<Play24Regular />}
                  onClick={runQuery}
                  disabled={isRunning}
                >
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Dropdown placeholder="Time range" style={{ minWidth: '150px' }}>
                  <Option>Last 24 hours</Option>
                  <Option>Last 7 days</Option>
                  <Option>Last 30 days</Option>
                  <Option>Custom</Option>
                </Dropdown>
                <Menu open={showQueries} onOpenChange={(_, data) => setShowQueries(data.open)}>
                  <MenuTrigger disableButtonEnhancement>
                    <Button appearance="subtle">Sample queries</Button>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList style={{ maxHeight: '400px', overflow: 'auto' }}>
                      {getAllCategories().map(category => (
                        <div key={category}>
                          <div className={styles.queryCategory}>{category}</div>
                          {getQueriesByCategory(category).map(q => (
                            <MenuItem
                              key={q.id}
                              onClick={() => handleSelectPrecannedQuery(q)}
                              secondaryContent={q.description}
                            >
                              {q.name}
                            </MenuItem>
                          ))}
                        </div>
                      ))}
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </div>
              <div className={styles.toolbarRight}>
                <Button appearance="subtle" icon={<Save24Regular />}>Save</Button>
                <Menu open={showHistory} onOpenChange={(_, data) => setShowHistory(data.open)}>
                  <MenuTrigger disableButtonEnhancement>
                    <Button appearance="subtle" icon={<Clock24Regular />}>History</Button>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList style={{ maxHeight: '400px', overflow: 'auto', minWidth: '350px' }}>
                      {history.length === 0 ? (
                        <MenuItem disabled>No query history</MenuItem>
                      ) : (
                        <>
                          <MenuItem onClick={clearHistory}>Clear history</MenuItem>
                          {history.slice(0, 20).map(item => (
                            <MenuItem
                              key={item.id}
                              onClick={() => handleSelectHistoryItem(item.query)}
                              secondaryContent={`${formatTimestamp(item.timestamp)}${item.rowCount !== undefined ? ` · ${item.rowCount} rows` : ''}${item.error ? ' · Error' : ''}`}
                            >
                              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                {item.query.substring(0, 50)}{item.query.length > 50 ? '...' : ''}
                              </span>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </MenuList>
                  </MenuPopover>
                </Menu>
                <Button appearance="subtle" icon={<ArrowDownload24Regular />}>Export</Button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <div className={styles.editorTabs}>
                  <button className={`${styles.editorTab} ${styles.editorTabActive}`}>Query 1</button>
                  <button className={styles.editorTab}>+ New query</button>
                </div>
              </div>
              <Editor
                height="200px"
                language="plaintext"
                theme="vs-dark"
                value={query}
                onChange={(value) => setQuery(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Consolas, Monaco, monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                Results: {results.rows.length} rows returned
              </div>
              <div className={styles.toolbarRight}>
                <Button appearance="subtle" size="small">Columns</Button>
                <Button appearance="subtle" size="small" icon={<ArrowDownload24Regular />}>Export</Button>
              </div>
            </div>

            <div className={styles.resultsTable}>
              {isRunning ? (
                <div className={styles.loadingOverlay}>
                  <Spinner size="medium" label="Running query..." />
                </div>
              ) : results.columns.length > 0 ? (
                <>
                  <div className={styles.tableHeader}>
                    {results.columns.map((col) => (
                      <div key={col} className={styles.tableHeaderCell}>{col}</div>
                    ))}
                  </div>
                  {results.rows.map((row, idx) => (
                    <div key={idx} className={styles.tableRow}>
                      {results.columns.map((col) => (
                        <div key={col} className={styles.tableCell}>
                          {formatValue(row[col])}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#a19f9d' }}>
                  {error ? 'Query failed. Please check the error above.' : 'Run a query to see results.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schema Sidebar */}
        <div className={styles.schemaSidebar}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Tables</span>
          </div>
          <div className={styles.schemaSection}>
            {tables.map((table) => (
              <div
                key={table}
                className={styles.schemaTable}
                onClick={() => handleTableClick(table)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronRight20Regular />
                {table}
              </div>
            ))}
          </div>

          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Sample Queries</span>
          </div>
          <div className={styles.schemaSection}>
            {precannedQueries.slice(0, 5).map((q) => (
              <div
                key={q.id}
                className={styles.precannedQuery}
                onClick={() => handleSelectPrecannedQuery(q)}
              >
                <ChevronRight20Regular />
                {q.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
