const BASE = 'https://api.worldbank.org/v2'
const COUNTRIES = 'US;CN;DE;JP;IN;GB;FR;BR;IT;CA'

// ISO2 → display label mapping (World Bank uses GB, not UK)
export const WB_LABEL: Record<string, string> = {
  US: 'USA', CN: 'China', DE: 'Germany', JP: 'Japan', IN: 'India',
  GB: 'UK',  FR: 'France', BR: 'Brazil', IT: 'Italy', CA: 'Canada',
}

export interface WBDataPoint {
  countryCode: string
  label: string
  value: number
}

interface WBRawItem {
  countryiso3code: string
  country: { id: string; value: string }
  value: number | null
  date: string
}

async function fetchIndicator(indicator: string): Promise<WBDataPoint[]> {
  const url = `${BASE}/country/${COUNTRIES}/indicator/${indicator}?format=json&mrv=1&per_page=10`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`)
  const json = await res.json() as [unknown, WBRawItem[]]
  const items = json[1] ?? []
  return items
    .filter(d => d.value !== null)
    .map(d => ({
      countryCode: d.country.id,
      label: WB_LABEL[d.country.id] ?? d.country.value,
      value: d.value as number,
    }))
}

export async function fetchGDP(): Promise<WBDataPoint[]> {
  // NY.GDP.MKTP.CD = GDP current USD → convert to trillions
  const data = await fetchIndicator('NY.GDP.MKTP.CD')
  return data
    .map(d => ({ ...d, value: Math.round((d.value / 1e12) * 10) / 10 }))
    .sort((a, b) => b.value - a.value)
}

export async function fetchInflation(): Promise<WBDataPoint[]> {
  // FP.CPI.TOTL.ZG = Consumer price inflation, annual %
  const data = await fetchIndicator('FP.CPI.TOTL.ZG')
  return data.map(d => ({ ...d, value: Math.round(d.value * 10) / 10 }))
}

export async function fetchGDPGrowth(): Promise<WBDataPoint[]> {
  // NY.GDP.MKTP.KD.ZG = GDP growth, annual %
  const data = await fetchIndicator('NY.GDP.MKTP.KD.ZG')
  return data
    .map(d => ({ ...d, value: Math.round(d.value * 10) / 10 }))
    .sort((a, b) => b.value - a.value)
}
