import type { DataSet } from '../types/data'
import { healthcareDataSet } from './healthcare'
import { financialDataSet } from './financial'

export const dataSets: Record<string, DataSet> = {
  healthcare: healthcareDataSet,
  financial: financialDataSet,
}

export function getDataSet(id: string): DataSet | undefined {
  return dataSets[id]
}

export function getAllDataSets(): DataSet[] {
  return Object.values(dataSets)
}

export { healthcareDataSet, financialDataSet }
