const PREFIX = 'aethon_infra_'

export type InfraValues = Record<string, string>

export function getInfraConfig(service: string): InfraValues {
  try {
    const raw = localStorage.getItem(PREFIX + service.toLowerCase().replace(/\s+/g, '_'))
    return raw ? (JSON.parse(raw) as InfraValues) : {}
  } catch {
    return {}
  }
}

export function saveInfraConfig(service: string, values: InfraValues) {
  try {
    localStorage.setItem(PREFIX + service.toLowerCase().replace(/\s+/g, '_'), JSON.stringify(values))
  } catch { /* storage unavailable */ }
}

export function isInfraConfigured(service: string): boolean {
  const vals = getInfraConfig(service)
  return Object.values(vals).some(v => v.trim().length > 0)
}
