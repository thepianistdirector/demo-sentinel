import { useState, useEffect, useCallback } from 'react'

export interface QueryHistoryItem {
  id: string
  query: string
  timestamp: number
  rowCount?: number
  error?: string
}

const STORAGE_KEY = 'sentinel-demo-query-history'
const MAX_HISTORY_ITEMS = 50

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as QueryHistoryItem[]
        setHistory(parsed)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {
      // Ignore localStorage errors
    }
  }, [history])

  const addToHistory = useCallback((query: string, rowCount?: number, error?: string) => {
    const item: QueryHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      query: query.trim(),
      timestamp: Date.now(),
      rowCount,
      error
    }

    setHistory(prev => {
      // Remove duplicate queries (keep the newest)
      const filtered = prev.filter(h => h.query.trim() !== query.trim())
      // Add new item at the beginning and limit size
      return [item, ...filtered].slice(0, MAX_HISTORY_ITEMS)
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}
