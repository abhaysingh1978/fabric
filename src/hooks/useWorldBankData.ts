import { useState, useEffect } from 'react'
import { fetchGDP, fetchInflation, fetchGDPGrowth, type WBDataPoint } from '@lib/data/worldBank'

export interface WorldBankData {
  gdp: WBDataPoint[]
  inflation: WBDataPoint[]
  growth: WBDataPoint[]
}

type Status = 'loading' | 'ready' | 'error'

// Module-level cache so repeated mounts don't re-fetch
let cache: WorldBankData | null = null
let cachePromise: Promise<WorldBankData> | null = null

async function loadAll(): Promise<WorldBankData> {
  if (cache) return cache
  if (cachePromise) return cachePromise

  cachePromise = Promise.all([fetchGDP(), fetchInflation(), fetchGDPGrowth()])
    .then(([gdp, inflation, growth]) => {
      cache = { gdp, inflation, growth }
      return cache
    })

  return cachePromise
}

export function useWorldBankData() {
  const [data, setData] = useState<WorldBankData | null>(cache)
  const [status, setStatus] = useState<Status>(cache ? 'ready' : 'loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (cache) return
    setStatus('loading')
    loadAll()
      .then(d => { setData(d); setStatus('ready') })
      .catch(err => { setError(err instanceof Error ? err.message : String(err)); setStatus('error') })
  }, [])

  return { data, status, error }
}
