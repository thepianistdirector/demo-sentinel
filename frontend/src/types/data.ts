export interface SecurityEvent {
  id: string
  timeGenerated: string
  computer: string
  account: string
  eventID: number
  activity: string
  logonType?: number
  ipAddress?: string
  process?: string
  commandLine?: string
  sourceTable: string
}

export interface Incident {
  id: string
  title: string
  severity: 'High' | 'Medium' | 'Low' | 'Informational'
  status: 'New' | 'Active' | 'Closed'
  owner?: string
  createdTime: string
  lastModifiedTime: string
  description: string
  alertCount: number
  tactics: string[]
  relatedEntities: string[]
}

export interface Alert {
  id: string
  alertName: string
  severity: 'High' | 'Medium' | 'Low' | 'Informational'
  status: 'New' | 'InProgress' | 'Resolved' | 'Dismissed'
  timeGenerated: string
  description: string
  providerName: string
  tactics: string[]
  entities: string[]
}

export interface DataConnector {
  id: string
  name: string
  provider: string
  status: 'connected' | 'not_connected' | 'error'
  lastDataReceived?: string
  dataTypes: string[]
}

export interface DataSet {
  id: string
  name: string
  industry: string
  securityEvents: SecurityEvent[]
  incidents: Incident[]
  alerts: Alert[]
  connectors: DataConnector[]
}
