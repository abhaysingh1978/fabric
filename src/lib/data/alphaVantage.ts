const BASE = 'https://www.alphavantage.co/query'

export interface DailyBar {
  date: string
  close: number
  volume: number
}

export interface SectorWeight {
  sector: string
  weight: number
  color: string
}

// Sector ETFs → label/color mapping
const SECTOR_ETFS: Array<{ symbol: string; label: string; color: string }> = [
  { symbol: 'XLK', label: 'Tech',     color: '#00D4FF' },
  { symbol: 'XLF', label: 'Finance',  color: '#7C3AED' },
  { symbol: 'XLV', label: 'Health',   color: '#10B981' },
  { symbol: 'XLE', label: 'Energy',   color: '#F59E0B' },
]

async function fetchDaily(symbol: string, apiKey: string): Promise<DailyBar[]> {
  const url = `${BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`)
  const json = await res.json() as Record<string, unknown>

  if (json['Note'] || json['Information']) {
    throw new Error('Alpha Vantage rate limit reached. Try again in a minute.')
  }

  const series = json['Time Series (Daily)'] as Record<string, Record<string, string>> | undefined
  if (!series) throw new Error('No data returned from Alpha Vantage')

  return Object.entries(series)
    .slice(0, 30)
    .map(([date, bar]) => ({
      date,
      close: parseFloat(bar['4. close']),
      volume: parseInt(bar['5. volume'], 10),
    }))
    .reverse()
}

export async function fetchSPYHistory(apiKey: string): Promise<DailyBar[]> {
  // With `demo` key AV only supports IBM — fall through gracefully
  const symbol = apiKey === 'demo' ? 'IBM' : 'SPY'
  return fetchDaily(symbol, apiKey)
}

export async function fetchSectorWeights(apiKey: string): Promise<SectorWeight[]> {
  if (apiKey === 'demo') throw new Error('demo key does not support sector data')
  const results: SectorWeight[] = []
  let total = 0

  for (const etf of SECTOR_ETFS) {
    try {
      const bars = await fetchDaily(etf.symbol, apiKey)
      const weight = bars.at(-1)?.close ?? 0
      results.push({ sector: etf.label, weight, color: etf.color })
      total += weight
    } catch {
      // skip failed ETF
    }
  }

  if (results.length === 0) throw new Error('No sector data available')

  // Normalise to % and add "Other" remainder
  const normalised = results.map(r => ({ ...r, weight: Math.round((r.weight / total) * 100) }))
  const usedPct = normalised.reduce((s, r) => s + r.weight, 0)
  normalised.push({ sector: 'Other', weight: 100 - usedPct, color: '#1E2A3A' })
  return normalised
}
