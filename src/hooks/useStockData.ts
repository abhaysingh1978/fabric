import { useState, useEffect } from 'react'
import { fetchSPYHistory, type DailyBar } from '@lib/data/alphaVantage'

type Status = 'loading' | 'ready' | 'error'

// Module-level cache keyed by API key
const dataCache = new Map<string, DailyBar[]>()
const promiseCache = new Map<string, Promise<DailyBar[]>>()

export function useStockData() {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY ?? ''
  const [bars, setBars] = useState<DailyBar[] | null>(dataCache.get(apiKey) ?? null)
  const [status, setStatus] = useState<Status>(dataCache.has(apiKey) ? 'ready' : 'loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!apiKey || dataCache.has(apiKey)) return
    setStatus('loading')

    let p = promiseCache.get(apiKey)
    if (!p) {
      p = fetchSPYHistory(apiKey)
      promiseCache.set(apiKey, p)
    }

    p
      .then(data => {
        dataCache.set(apiKey, data)
        setBars(data)
        setStatus('ready')
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : String(err))
        setStatus('error')
      })
  }, [apiKey])

  return { bars, status, error, hasKey: !!apiKey }
}
