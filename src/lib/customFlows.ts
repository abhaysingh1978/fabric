import { DEMOS } from '@data/usecases'
import type { Category, KPI, UseCase } from '@types/index'

const STORAGE_KEY   = 'fabric_custom_flows'
const OVERRIDES_KEY = 'fabric_flow_overrides'

// ── Custom flows ──────────────────────────────────────────────────────────────

export interface StoredFlow {
  categoryKey: string
  categoryLabel: string
  categoryIcon: string
  categoryColor: string
  flowKey: string
  caseKey: string
  label: string
  icon: string
  desc: string
  datasets: string[]
  agents: string[]
  kpis: KPI[]
  createdAt: string
}

export function getStoredFlows(): StoredFlow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredFlow[]) : []
  } catch { return [] }
}

function saveStoredFlows(flows: StoredFlow[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(flows)) } catch { /* unavailable */ }
}

export function upsertFlow(flow: StoredFlow) {
  const flows = getStoredFlows()
  const idx = flows.findIndex(f => f.caseKey === flow.caseKey)
  if (idx >= 0) flows[idx] = flow
  else flows.push(flow)
  saveStoredFlows(flows)
}

export function deleteFlow(caseKey: string) {
  saveStoredFlows(getStoredFlows().filter(f => f.caseKey !== caseKey))
}

// ── Built-in flow overrides ───────────────────────────────────────────────────

export interface FlowOverride {
  categoryKey: string   // matches DEMOS key, e.g. 'BFSI'
  flowKey: string       // matches sub key, e.g. 'stock'
  label: string
  icon: string
  desc: string
  datasets: string[]
  agents: string[]
  kpis: KPI[]
}

export function getFlowOverrides(): FlowOverride[] {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as FlowOverride[]) : []
  } catch { return [] }
}

function saveFlowOverrides(overrides: FlowOverride[]) {
  try { localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides)) } catch { /* unavailable */ }
}

export function upsertOverride(override: FlowOverride) {
  const overrides = getFlowOverrides()
  const idx = overrides.findIndex(o => o.categoryKey === override.categoryKey && o.flowKey === override.flowKey)
  if (idx >= 0) overrides[idx] = override
  else overrides.push(override)
  saveFlowOverrides(overrides)
}

export function deleteOverride(categoryKey: string, flowKey: string) {
  saveFlowOverrides(getFlowOverrides().filter(o => !(o.categoryKey === categoryKey && o.flowKey === flowKey)))
}

export function hasOverride(categoryKey: string, flowKey: string): boolean {
  return getFlowOverrides().some(o => o.categoryKey === categoryKey && o.flowKey === flowKey)
}

// ── Merged category tree ──────────────────────────────────────────────────────

export function getMergedCategories(): Record<string, Category> {
  const stored   = getStoredFlows()
  const overrides = getFlowOverrides()

  // Build overrides lookup
  const ovMap = new Map<string, FlowOverride>()
  for (const ov of overrides) ovMap.set(`${ov.categoryKey}::${ov.flowKey}`, ov)

  // Apply overrides to built-in DEMOS (non-mutating)
  const base: Record<string, Category> = {}
  for (const [catKey, cat] of Object.entries(DEMOS)) {
    const newSub: Record<string, UseCase> = {}
    for (const [flowKey, uc] of Object.entries(cat.sub)) {
      const ov = ovMap.get(`${catKey}::${flowKey}`)
      newSub[flowKey] = ov
        ? { ...uc, label: ov.label, icon: ov.icon, desc: ov.desc, datasets: ov.datasets, agents: ov.agents, kpis: ov.kpis }
        : uc
    }
    base[catKey] = { ...cat, sub: newSub }
  }

  if (stored.length === 0) return base

  // Append custom categories
  const custom: Record<string, Category> = {}
  for (const f of stored) {
    if (!custom[f.categoryKey]) {
      custom[f.categoryKey] = { label: f.categoryLabel, icon: f.categoryIcon, color: f.categoryColor, sub: {} }
    }
    custom[f.categoryKey].sub[f.flowKey] = {
      label: f.label, icon: f.icon, desc: f.desc,
      datasets: f.datasets, agents: f.agents, kpis: f.kpis, caseKey: f.caseKey,
    }
  }
  return { ...base, ...custom }
}

// ── Key helpers ───────────────────────────────────────────────────────────────

export function makeKeys(label: string): { flowKey: string; caseKey: string } {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 20) || 'flow'
  const suffix = Date.now().toString(36).slice(-4)
  return { flowKey: `${slug}_${suffix}`, caseKey: `custom_${slug}_${suffix}` }
}

export function makeCategoryKey(label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 16) || 'cat'
  return `custom_${slug}_${Date.now().toString(36).slice(-3)}`
}
