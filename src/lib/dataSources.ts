import type { DataSource } from '@types/index'

const PREFIX = 'fabric_ds_'

function key(flowId: string): string {
  return PREFIX + flowId.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export function getSources(flowId: string): DataSource[] {
  try {
    const raw = localStorage.getItem(key(flowId))
    return raw ? (JSON.parse(raw) as DataSource[]) : []
  } catch { return [] }
}

export function saveSources(flowId: string, sources: DataSource[]) {
  try { localStorage.setItem(key(flowId), JSON.stringify(sources)) } catch { /* unavailable */ }
}

export function addSource(source: DataSource) {
  const list = getSources(source.flowId)
  saveSources(source.flowId, [...list, source])
}

export function updateSource(updated: DataSource) {
  const list = getSources(updated.flowId)
  saveSources(updated.flowId, list.map(s => s.id === updated.id ? updated : s))
}

export function deleteSource(flowId: string, id: string) {
  saveSources(flowId, getSources(flowId).filter(s => s.id !== id))
}

export function toggleSource(flowId: string, id: string) {
  const list = getSources(flowId)
  saveSources(flowId, list.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
}

export function getAllSources(): DataSource[] {
  const results: DataSource[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(PREFIX)) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) ?? '[]') as DataSource[]
        results.push(...arr)
      } catch { /* skip */ }
    }
  }
  return results
}

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
