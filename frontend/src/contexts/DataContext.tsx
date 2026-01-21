import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { DataSet, SecurityEvent, Incident, Alert, DataConnector } from '../types/data'
import { dataSets, getDataSet, getAllDataSets } from '../data'
import { useAuth } from './AuthContext'

interface DataContextType {
  currentDataSet: DataSet | null
  currentDataSetId: string | null
  availableDataSets: DataSet[]
  securityEvents: SecurityEvent[]
  incidents: Incident[]
  alerts: Alert[]
  connectors: DataConnector[]
  isLoading: boolean
  canSwitchDataSet: boolean
  switchDataSet: (dataSetId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [currentDataSetId, setCurrentDataSetId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Determine if user can switch data sets (admin only)
  const canSwitchDataSet = user?.role === 'admin'

  // Get available data sets based on user role
  const availableDataSets = canSwitchDataSet
    ? getAllDataSets()
    : user?.dataSetId
      ? [getDataSet(user.dataSetId)].filter((ds): ds is DataSet => ds !== undefined)
      : []

  // Load initial data set based on user
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCurrentDataSetId(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // For admin, default to first available data set
    // For clients, use their assigned data set
    const initialDataSetId = user.role === 'admin'
      ? Object.keys(dataSets)[0]
      : user.dataSetId || null

    setCurrentDataSetId(initialDataSetId)
    setIsLoading(false)
  }, [isAuthenticated, user])

  const switchDataSet = (dataSetId: string) => {
    if (!canSwitchDataSet) {
      console.warn('User does not have permission to switch data sets')
      return
    }

    if (!dataSets[dataSetId]) {
      console.warn(`Data set ${dataSetId} not found`)
      return
    }

    setCurrentDataSetId(dataSetId)
  }

  const currentDataSet = currentDataSetId ? getDataSet(currentDataSetId) || null : null

  const value: DataContextType = {
    currentDataSet,
    currentDataSetId,
    availableDataSets,
    securityEvents: currentDataSet?.securityEvents || [],
    incidents: currentDataSet?.incidents || [],
    alerts: currentDataSet?.alerts || [],
    connectors: currentDataSet?.connectors || [],
    isLoading,
    canSwitchDataSet,
    switchDataSet,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextType {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
