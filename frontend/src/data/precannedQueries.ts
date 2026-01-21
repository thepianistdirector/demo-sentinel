export interface PrecannedQuery {
  id: string
  name: string
  description: string
  category: 'Security' | 'Identity' | 'Compliance' | 'Performance' | 'Custom'
  query: string
}

export const precannedQueries: PrecannedQuery[] = [
  // Security Queries
  {
    id: 'failed-logons',
    name: 'Failed Logon Attempts',
    description: 'Shows failed authentication attempts (EventID 4625)',
    category: 'Security',
    query: `SecurityEvent
| where EventID == 4625
| summarize count() by Account
| top 10 by count_`
  },
  {
    id: 'successful-logons',
    name: 'Successful Logons by User',
    description: 'Shows successful authentication events grouped by user',
    category: 'Security',
    query: `SecurityEvent
| where EventID == 4624
| summarize count() by Account
| sort by count_ desc
| take 20`
  },
  {
    id: 'security-by-computer',
    name: 'Events by Computer',
    description: 'Count of security events per computer',
    category: 'Security',
    query: `SecurityEvent
| summarize EventCount = count() by Computer
| sort by EventCount desc`
  },
  {
    id: 'top-event-types',
    name: 'Top Event Types',
    description: 'Most common security event types',
    category: 'Security',
    query: `SecurityEvent
| summarize count() by EventID, Activity
| sort by count_ desc
| take 15`
  },
  {
    id: 'high-privilege-logons',
    name: 'High Privilege Logons',
    description: 'Logons with elevated privileges',
    category: 'Security',
    query: `SecurityEvent
| where EventID == 4672
| project TimeGenerated, Account, Computer, Activity
| sort by TimeGenerated desc
| take 50`
  },
  {
    id: 'account-lockouts',
    name: 'Account Lockouts',
    description: 'Account lockout events (EventID 4740)',
    category: 'Security',
    query: `SecurityEvent
| where EventID == 4740
| project TimeGenerated, Account, Computer
| sort by TimeGenerated desc`
  },

  // Identity Queries
  {
    id: 'user-activity',
    name: 'User Activity Summary',
    description: 'Summary of all user activity',
    category: 'Identity',
    query: `SecurityEvent
| where Account != ""
| summarize EventCount = count(), DistinctComputers = dcount(Computer) by Account
| sort by EventCount desc
| take 25`
  },
  {
    id: 'admin-activity',
    name: 'Administrator Activity',
    description: 'Events from administrator accounts',
    category: 'Identity',
    query: `SecurityEvent
| where Account contains "admin"
| summarize count() by Account, Activity
| sort by count_ desc`
  },
  {
    id: 'service-accounts',
    name: 'Service Account Activity',
    description: 'Activity from service accounts',
    category: 'Identity',
    query: `SecurityEvent
| where Account contains "svc" or Account contains "service"
| summarize count() by Account, Computer
| sort by count_ desc`
  },

  // Compliance Queries
  {
    id: 'all-events',
    name: 'All Security Events',
    description: 'Complete list of security events',
    category: 'Compliance',
    query: `SecurityEvent
| project TimeGenerated, EventID, Activity, Account, Computer
| sort by TimeGenerated desc
| take 100`
  },
  {
    id: 'distinct-users',
    name: 'Distinct Users',
    description: 'List of all unique user accounts',
    category: 'Compliance',
    query: `SecurityEvent
| distinct Account
| sort by Account asc`
  },
  {
    id: 'distinct-computers',
    name: 'Distinct Computers',
    description: 'List of all unique computer names',
    category: 'Compliance',
    query: `SecurityEvent
| distinct Computer
| sort by Computer asc`
  },

  // Performance Queries
  {
    id: 'events-per-hour',
    name: 'Event Volume Analysis',
    description: 'Count of events for performance analysis',
    category: 'Performance',
    query: `SecurityEvent
| summarize TotalEvents = count()`
  },
  {
    id: 'events-by-type',
    name: 'Event Distribution by Type',
    description: 'Distribution of events across event types',
    category: 'Performance',
    query: `SecurityEvent
| summarize count() by EventID
| sort by count_ desc`
  },

  // Custom Queries
  {
    id: 'search-by-account',
    name: 'Search by Account Name',
    description: 'Find events for a specific account (modify the filter)',
    category: 'Custom',
    query: `SecurityEvent
| where Account contains "admin"
| project TimeGenerated, EventID, Activity, Account, Computer
| sort by TimeGenerated desc
| take 50`
  },
  {
    id: 'search-by-computer',
    name: 'Search by Computer',
    description: 'Find events for a specific computer (modify the filter)',
    category: 'Custom',
    query: `SecurityEvent
| where Computer contains "DC"
| project TimeGenerated, EventID, Activity, Account, Computer
| sort by TimeGenerated desc
| take 50`
  },
  {
    id: 'search-by-eventid',
    name: 'Search by Event ID',
    description: 'Find events with a specific Event ID (modify the filter)',
    category: 'Custom',
    query: `SecurityEvent
| where EventID == 4624
| project TimeGenerated, Account, Computer, Activity
| take 50`
  }
]

export function getQueryById(id: string): PrecannedQuery | undefined {
  return precannedQueries.find(q => q.id === id)
}

export function getQueriesByCategory(category: PrecannedQuery['category']): PrecannedQuery[] {
  return precannedQueries.filter(q => q.category === category)
}

export function getAllCategories(): PrecannedQuery['category'][] {
  return ['Security', 'Identity', 'Compliance', 'Performance', 'Custom']
}
