import { useState, useRef, useMemo } from 'react'
import { COLORS } from '@lib/theme'
import { DEMOS } from '@data/usecases'
import {
  getStoredFlows, upsertFlow, deleteFlow, makeKeys, makeCategoryKey,
  getFlowOverrides, upsertOverride, deleteOverride,
  type StoredFlow, type FlowOverride,
} from '@lib/customFlows'
import { getDatasetSuggestions, getAgentSuggestions } from '@data/flowSuggestions'
import type { KPI } from '@types/index'

interface FlowManagerProps { onClose: () => void }

// ── Draft ─────────────────────────────────────────────────────────────────────

type EditMode = 'custom' | 'builtin'

interface FlowDraft {
  mode: EditMode
  // builtin-only
  builtinCatKey: string
  builtinFlowKey: string
  // shared fields
  icon: string
  label: string
  desc: string
  // custom-only: category
  catMode: 'existing' | 'new'
  catKey: string
  newCatLabel: string
  newCatIcon: string
  newCatColor: string
  // data
  datasets: string[]
  agents: string[]
  kpis: Array<{ l: string; v: string; d: string }>
  // edit tracking (empty = new)
  editCaseKey: string
  origCatKey: string
}

const CAT_COLORS = [
  '#00D4FF', '#10B981', '#7C3AED', '#F59E0B', '#EF4444',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
]

const BLANK_DRAFT: FlowDraft = {
  mode: 'custom', builtinCatKey: '', builtinFlowKey: '',
  icon: '⚡', label: '', desc: '',
  catMode: 'new', catKey: '', newCatLabel: '', newCatIcon: '◈', newCatColor: '#00D4FF',
  datasets: [], agents: [],
  kpis: [{ l: '', v: '', d: '' }, { l: '', v: '', d: '' }, { l: '', v: '', d: '' }, { l: '', v: '', d: '' }],
  editCaseKey: '', origCatKey: '',
}

function kpiRows(source: KPI[]): Array<{ l: string; v: string; d: string }> {
  const rows = source.map(k => ({ l: k.l, v: k.v, d: k.d ?? '' }))
  while (rows.length < 4) rows.push({ l: '', v: '', d: '' })
  return rows
}

function customToDraft(f: StoredFlow): FlowDraft {
  return {
    mode: 'custom', builtinCatKey: '', builtinFlowKey: '',
    icon: f.icon, label: f.label, desc: f.desc,
    catMode: 'existing', catKey: f.categoryKey,
    newCatLabel: f.categoryLabel, newCatIcon: f.categoryIcon, newCatColor: f.categoryColor,
    datasets: [...f.datasets], agents: [...f.agents], kpis: kpiRows(f.kpis),
    editCaseKey: f.caseKey, origCatKey: f.categoryKey,
  }
}

function builtinToDraft(catKey: string, flowKey: string, ov: FlowOverride | undefined): FlowDraft {
  const uc = DEMOS[catKey].sub[flowKey]
  return {
    mode: 'builtin', builtinCatKey: catKey, builtinFlowKey: flowKey,
    icon: ov?.icon ?? uc.icon, label: ov?.label ?? uc.label, desc: ov?.desc ?? uc.desc,
    catMode: 'existing', catKey, newCatLabel: '', newCatIcon: '', newCatColor: '',
    datasets: [...(ov?.datasets ?? uc.datasets)], agents: [...(ov?.agents ?? uc.agents)],
    kpis: kpiRows(ov?.kpis ?? uc.kpis),
    editCaseKey: uc.caseKey, origCatKey: catKey,
  }
}

// ── TagInput with autocomplete ────────────────────────────────────────────────

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx < 0) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: `${COLORS.accent}28`, color: COLORS.accent, borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function TagInput({ tags, onChange, placeholder, suggestions = [], accentColor }: {
  tags: string[]
  onChange: (t: string[]) => void
  placeholder: string
  suggestions?: string[]
  accentColor?: string
}) {
  const accent = accentColor ?? COLORS.accent
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase()
    const existing = new Set(tags)
    const list = suggestions.filter(s => !existing.has(s))
    return q ? list.filter(s => s.toLowerCase().includes(q)).slice(0, 10) : list.slice(0, 10)
  }, [input, suggestions, tags])

  function addTag(val: string) {
    const v = val.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
    setHighlighted(-1)
    inputRef.current?.focus()
  }

  function commit() {
    if (highlighted >= 0 && filtered[highlighted]) addTag(filtered[highlighted])
    else if (input.trim()) addTag(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',')  { e.preventDefault(); commit() }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Escape')    { setOpen(false); setHighlighted(-1) }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) onChange(tags.slice(0, -1))
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
          background: COLORS.bgCard,
          border: `1px solid ${open ? accent : COLORS.border}`,
          borderRadius: 6, padding: '6px 8px', cursor: 'text', minHeight: 40,
          transition: 'border-color 0.15s',
        }}
      >
        {tags.map(t => (
          <span key={t} style={{
            fontFamily: 'monospace', fontSize: 10, color: COLORS.text,
            background: `${accent}18`, border: `1px solid ${accent}44`,
            borderRadius: 4, padding: '2px 8px',
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          }}>
            {t}
            <button
              onClick={e => { e.stopPropagation(); onChange(tags.filter(x => x !== t)) }}
              style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0 }}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setHighlighted(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (blurTimer.current) clearTimeout(blurTimer.current); setOpen(true) }}
          onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 160) }}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.text, background: 'transparent', border: 'none', outline: 'none', minWidth: 140, flex: 1, padding: '2px 0' }}
        />
      </div>

      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: COLORS.bgPanel, border: `1px solid ${COLORS.borderBright}`,
          borderRadius: 7, boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
          zIndex: 1300, overflow: 'hidden',
        }}>
          <div style={{
            padding: '6px 12px 5px', fontFamily: 'monospace', fontSize: 8,
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: accent, background: `${accent}0c`, borderBottom: `1px solid ${COLORS.border}`,
          }}>
            {input.trim() ? `Matching "${input.trim()}"` : 'Suggested for this flow'} · {filtered.length} options · ↑↓ navigate · Enter to add
          </div>
          <div style={{ maxHeight: 210, overflowY: 'auto' }}>
            {filtered.map((s, i) => (
              <div
                key={s}
                onMouseDown={e => { e.preventDefault(); addTag(s) }}
                onMouseEnter={() => setHighlighted(i)}
                style={{
                  padding: '7px 14px', fontFamily: 'monospace', fontSize: 11,
                  color: highlighted === i ? COLORS.text : COLORS.textDim,
                  background: highlighted === i ? `${accent}14` : 'transparent',
                  cursor: 'pointer', transition: 'background 0.08s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: highlighted === i ? accent : COLORS.border }} />
                {highlightMatch(s, input.trim())}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function FL({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 5 }}>
      {children}
    </div>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return <span style={{ color: COLORS.accentDanger, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>— {children}</span>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function TI(value: string, onChange: (v: string) => void, opts?: { placeholder?: string; maxLength?: number; rows?: number }) {
  const style: React.CSSProperties = {
    fontFamily: 'monospace', fontSize: 12, color: COLORS.text,
    background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
    borderRadius: 6, padding: '7px 10px', outline: 'none', width: '100%',
  }
  if (opts?.rows) return <textarea value={value} onChange={e => onChange(e.target.value)} rows={opts.rows} placeholder={opts.placeholder} style={{ ...style, resize: 'vertical', lineHeight: 1.5 }} />
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={opts?.placeholder} maxLength={opts?.maxLength} style={style} />
}

// ── FlowManager ───────────────────────────────────────────────────────────────

export function FlowManager({ onClose }: FlowManagerProps) {
  const [flows,     setFlows]     = useState<StoredFlow[]>(() => getStoredFlows())
  const [overrides, setOverrides] = useState<FlowOverride[]>(() => getFlowOverrides())
  const [draft,     setDraft]     = useState<FlowDraft | null>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [errors,    setErrors]    = useState<Record<string, string>>({})

  function refreshAll() { setFlows(getStoredFlows()); setOverrides(getFlowOverrides()) }

  // Custom category map (for the editor dropdown)
  const customCats = useMemo(() => {
    const m: Record<string, { label: string; icon: string; color: string }> = {}
    for (const f of flows) {
      if (!m[f.categoryKey]) m[f.categoryKey] = { label: f.categoryLabel, icon: f.categoryIcon, color: f.categoryColor }
    }
    return m
  }, [flows])

  // Override map for quick lookup
  const ovMap = useMemo(() => {
    const m = new Map<string, FlowOverride>()
    for (const ov of overrides) m.set(`${ov.categoryKey}::${ov.flowKey}`, ov)
    return m
  }, [overrides])

  // Context text drives suggestion ranking
  const contextText = useMemo(() => {
    if (!draft) return ''
    const catName = draft.mode === 'builtin'
      ? (DEMOS[draft.builtinCatKey]?.label ?? '')
      : draft.catMode === 'new' ? draft.newCatLabel : (customCats[draft.catKey]?.label ?? '')
    return `${draft.label} ${catName}`
  }, [draft?.label, draft?.catMode, draft?.newCatLabel, draft?.catKey, draft?.mode, draft?.builtinCatKey, customCats])

  const datasetSuggestions = useMemo(() => getDatasetSuggestions(contextText), [contextText])
  const agentSuggestions   = useMemo(() => getAgentSuggestions(contextText),   [contextText])

  // Editor accent colour matches the flow's category
  const editorAccent = useMemo(() => {
    if (!draft) return COLORS.accent
    if (draft.mode === 'builtin') return DEMOS[draft.builtinCatKey]?.color ?? COLORS.accent
    if (draft.catMode === 'new')  return draft.newCatColor || COLORS.accent
    return customCats[draft.catKey]?.color ?? COLORS.accent
  }, [draft?.mode, draft?.builtinCatKey, draft?.catMode, draft?.newCatColor, draft?.catKey, customCats])

  // ── Actions ──────────────────────────────────────────────────────────────────

  function startNew() {
    const existingKeys = Object.keys(customCats)
    setDraft({
      ...BLANK_DRAFT,
      catMode: existingKeys.length > 0 ? 'existing' : 'new',
      catKey: existingKeys[0] ?? '',
      newCatColor: CAT_COLORS[flows.length % CAT_COLORS.length],
    })
    setErrors({})
  }

  function startEditCustom(f: StoredFlow) { setDelConfirm(null); setDraft(customToDraft(f)); setErrors({}) }

  function startEditBuiltin(catKey: string, flowKey: string) {
    setDelConfirm(null)
    setDraft(builtinToDraft(catKey, flowKey, ovMap.get(`${catKey}::${flowKey}`)))
    setErrors({})
  }

  function handleDeleteCustom(caseKey: string) {
    deleteFlow(caseKey); refreshAll(); setDelConfirm(null)
    if (draft?.editCaseKey === caseKey) setDraft(null)
  }

  function handleResetBuiltin() {
    if (!draft || draft.mode !== 'builtin') return
    deleteOverride(draft.builtinCatKey, draft.builtinFlowKey)
    refreshAll(); setDraft(null)
  }

  function validate(d: FlowDraft): Record<string, string> {
    const e: Record<string, string> = {}
    if (!d.label.trim()) e.label = 'Name is required'
    if (!d.desc.trim())  e.desc  = 'Description is required'
    if (d.mode === 'custom') {
      if (d.catMode === 'new' && !d.newCatLabel.trim()) e.newCatLabel = 'Category name is required'
      if (d.catMode === 'existing' && !d.catKey)        e.catKey = 'Select a category'
    }
    if (d.datasets.length === 0) e.datasets = 'Add at least one dataset'
    if (d.agents.length === 0)   e.agents   = 'Add at least one agent'
    return e
  }

  function handleSave() {
    if (!draft) return
    const errs = validate(draft)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const kpis: KPI[] = draft.kpis
      .filter(k => k.l.trim() && k.v.trim())
      .map(k => ({ l: k.l.trim(), v: k.v.trim(), ...(k.d.trim() ? { d: k.d.trim() } : {}) }))

    if (draft.mode === 'builtin') {
      upsertOverride({
        categoryKey: draft.builtinCatKey, flowKey: draft.builtinFlowKey,
        label: draft.label.trim(),
        icon: draft.icon.trim() || (DEMOS[draft.builtinCatKey]?.sub[draft.builtinFlowKey]?.icon ?? '⚡'),
        desc: draft.desc.trim(), datasets: draft.datasets, agents: draft.agents, kpis,
      })
    } else {
      let catKey = draft.catKey, catLabel = '', catIcon = '', catColor = ''
      if (draft.catMode === 'new') {
        catKey    = (draft.editCaseKey && draft.origCatKey) ? draft.origCatKey : makeCategoryKey(draft.newCatLabel)
        catLabel  = draft.newCatLabel.trim()
        catIcon   = draft.newCatIcon.trim() || '◈'
        catColor  = draft.newCatColor
      } else {
        const ec  = customCats[catKey]
        catLabel  = ec.label; catIcon = ec.icon; catColor = ec.color
      }
      const { flowKey, caseKey } = draft.editCaseKey
        ? { flowKey: flows.find(f => f.caseKey === draft.editCaseKey)!.flowKey, caseKey: draft.editCaseKey }
        : makeKeys(draft.label)
      upsertFlow({
        categoryKey: catKey, categoryLabel: catLabel, categoryIcon: catIcon, categoryColor: catColor,
        flowKey, caseKey,
        label: draft.label.trim(), icon: draft.icon.trim() || '⚡',
        desc: draft.desc.trim(), datasets: draft.datasets, agents: draft.agents, kpis,
        createdAt: draft.editCaseKey
          ? (flows.find(f => f.caseKey === draft.editCaseKey)?.createdAt ?? new Date().toISOString())
          : new Date().toISOString(),
      })
    }
    refreshAll(); setDraft(null)
  }

  function up<K extends keyof FlowDraft>(key: K, val: FlowDraft[K]) {
    setDraft(d => d ? { ...d, [key]: val } : d)
    setErrors(e => { const n = { ...e }; delete n[key as string]; return n })
  }

  // ── Sidebar data ──────────────────────────────────────────────────────────────

  // Built-in flows with live override info for sidebar display
  const builtinSections = useMemo(() =>
    Object.entries(DEMOS).map(([catKey, cat]) => ({
      catKey, label: cat.label, icon: cat.icon, color: cat.color,
      flows: Object.entries(cat.sub).map(([flowKey, uc]) => {
        const ov = ovMap.get(`${catKey}::${flowKey}`)
        return { flowKey, caseKey: uc.caseKey, icon: ov?.icon ?? uc.icon, label: ov?.label ?? uc.label, isEdited: !!ov }
      }),
    }))
  , [ovMap])

  const customSections = useMemo(() =>
    Object.entries(customCats).map(([catKey, cat]) => ({
      catKey, ...cat, flows: flows.filter(f => f.categoryKey === catKey),
    }))
  , [customCats, flows])

  const isBuiltinActive = (catKey: string, flowKey: string) =>
    draft?.mode === 'builtin' && draft.builtinCatKey === catKey && draft.builtinFlowKey === flowKey

  const isCustomActive = (caseKey: string) =>
    draft?.mode === 'custom' && draft.editCaseKey === caseKey

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}
    >
      <div style={{
        width: 980, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        background: COLORS.bgPanel, border: `1px solid ${COLORS.borderBright}`,
        borderRadius: 12, boxShadow: `0 0 40px ${COLORS.accent2}22`, overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: COLORS.text }}>Flow Manager</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted, marginTop: 2 }}>
              Edit built-in flows or create custom ones — datasets and agents are suggested based on your flow context
            </div>
          </div>
          <button onClick={onClose} style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted, background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>
            ✕ Close
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── Left sidebar ── */}
          <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>

              {/* Built-in section */}
              <SidebarHeader label="Built-in Flows" count={Object.values(DEMOS).reduce((n, c) => n + Object.keys(c.sub).length, 0)} />
              {builtinSections.map(({ catKey, label, icon, color, flows: catFlows }) => (
                <div key={catKey}>
                  <CatLabel icon={icon} label={label} color={color} />
                  {catFlows.map(f => (
                    <FlowRow
                      key={f.flowKey}
                      icon={f.icon} label={f.label}
                      meta={f.isEdited ? 'edited' : 'built-in'}
                      metaColor={f.isEdited ? COLORS.accentWarn : COLORS.textMuted}
                      active={isBuiltinActive(catKey, f.flowKey)}
                      activeColor={color}
                      onClick={() => startEditBuiltin(catKey, f.flowKey)}
                    />
                  ))}
                </div>
              ))}

              {/* Custom section */}
              <div style={{ height: 1, background: COLORS.border, margin: '10px 0' }} />
              <SidebarHeader label="Custom Flows" count={flows.length} />
              {customSections.length === 0 ? (
                <div style={{ padding: '8px 16px 4px', fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, fontStyle: 'italic' }}>No custom flows yet</div>
              ) : customSections.map(({ catKey, label, icon, color, flows: catFlows }) => (
                <div key={catKey}>
                  <CatLabel icon={icon} label={label} color={color} />
                  {catFlows.map(f => (
                    <FlowRow
                      key={f.caseKey}
                      icon={f.icon} label={f.label}
                      meta={`${f.agents.length}a · ${f.datasets.length}d`}
                      metaColor={COLORS.textMuted}
                      active={isCustomActive(f.caseKey)}
                      activeColor={color}
                      onClick={() => startEditCustom(f)}
                      onDelete={() => setDelConfirm(f.caseKey)}
                      deleteConfirm={delConfirm === f.caseKey}
                      onDeleteConfirm={() => handleDeleteCustom(f.caseKey)}
                      onDeleteCancel={() => setDelConfirm(null)}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* New flow button */}
            <div style={{ padding: 12, borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
              <button
                onClick={startNew}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: COLORS.accent2, background: `${COLORS.accent2}12`, border: `1px solid ${COLORS.accent2}55`, borderRadius: 7, padding: '9px', cursor: 'pointer' }}
              >⊕ New Custom Flow</button>
            </div>
          </div>

          {/* ── Right: editor ── */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {draft === null ? (
              <WelcomeState onNew={startNew} />
            ) : (
              <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: COLORS.text }}>
                    {draft.mode === 'builtin'
                      ? (draft.editCaseKey ? 'Edit Built-in Flow' : '')
                      : (draft.editCaseKey ? 'Edit Custom Flow' : 'New Custom Flow')}
                  </div>
                  {draft.mode === 'builtin' && (
                    <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: DEMOS[draft.builtinCatKey]?.color ?? COLORS.accent, background: `${DEMOS[draft.builtinCatKey]?.color ?? COLORS.accent}18`, border: `1px solid ${DEMOS[draft.builtinCatKey]?.color ?? COLORS.accent}44`, borderRadius: 4, padding: '2px 8px' }}>
                      {DEMOS[draft.builtinCatKey]?.icon} {DEMOS[draft.builtinCatKey]?.label}
                    </span>
                  )}
                  {draft.mode === 'builtin' && ovMap.has(`${draft.builtinCatKey}::${draft.builtinFlowKey}`) && (
                    <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: COLORS.accentWarn, background: `${COLORS.accentWarn}18`, border: `1px solid ${COLORS.accentWarn}44`, borderRadius: 4, padding: '2px 8px' }}>
                      edited
                    </span>
                  )}
                </div>

                {/* ── Identity ── */}
                <Section title="Identity">
                  <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <FL>Icon</FL>
                      {TI(draft.icon, v => up('icon', v), { placeholder: '⚡', maxLength: 4 })}
                    </div>
                    <div>
                      <FL>Flow Name {errors.label && <Err>{errors.label}</Err>}</FL>
                      {TI(draft.label, v => up('label', v), { placeholder: 'e.g. Healthcare Analytics' })}
                    </div>
                  </div>
                  <FL>Description {errors.desc && <Err>{errors.desc}</Err>}</FL>
                  {TI(draft.desc, v => up('desc', v), { placeholder: 'What does this flow analyse or solve?', rows: 2 })}
                </Section>

                {/* ── Category (custom only) ── */}
                {draft.mode === 'custom' && (
                  <Section title="Category">
                    {Object.keys(customCats).length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {(['existing', 'new'] as const).map(mode => (
                          <button key={mode} onClick={() => up('catMode', mode)} style={{
                            fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                            color: draft.catMode === mode ? COLORS.accent : COLORS.textMuted,
                            background: draft.catMode === mode ? `${COLORS.accent}14` : COLORS.bgCard,
                            border: `1px solid ${draft.catMode === mode ? COLORS.accent : COLORS.border}`,
                            borderRadius: 5, padding: '5px 14px', cursor: 'pointer',
                          }}>{mode === 'existing' ? 'Use existing' : 'Create new'}</button>
                        ))}
                      </div>
                    )}
                    {draft.catMode === 'existing' ? (
                      <div>
                        <FL>Category {errors.catKey && <Err>{errors.catKey}</Err>}</FL>
                        <select value={draft.catKey} onChange={e => up('catKey', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.text, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '7px 10px', width: '100%', cursor: 'pointer' }}>
                          <option value="">— select —</option>
                          {Object.entries(customCats).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 10 }}>
                          <div>
                            <FL>Icon</FL>
                            {TI(draft.newCatIcon, v => up('newCatIcon', v), { placeholder: '◈', maxLength: 4 })}
                          </div>
                          <div>
                            <FL>Category Name {errors.newCatLabel && <Err>{errors.newCatLabel}</Err>}</FL>
                            {TI(draft.newCatLabel, v => up('newCatLabel', v), { placeholder: 'e.g. Healthcare' })}
                          </div>
                        </div>
                        <div>
                          <FL>Category Colour</FL>
                          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                            {CAT_COLORS.map(c => (
                              <button key={c} onClick={() => up('newCatColor', c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: `2px solid ${draft.newCatColor === c ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: draft.newCatColor === c ? `0 0 7px ${c}` : 'none' }} />
                            ))}
                            <input type="color" value={draft.newCatColor} onChange={e => up('newCatColor', e.target.value)} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </Section>
                )}

                {/* ── Datasets ── */}
                <Section title="Datasets">
                  <FL>
                    Data sources feeding this flow
                    {errors.datasets && <Err>{errors.datasets}</Err>}
                    <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: COLORS.accent, marginLeft: 8 }}>
                      · suggestions update as you type the flow name
                    </span>
                  </FL>
                  <TagInput tags={draft.datasets} onChange={v => up('datasets', v)} placeholder="Type or pick a suggestion…" suggestions={datasetSuggestions} accentColor={editorAccent} />
                </Section>

                {/* ── Agents ── */}
                <Section title="Agents">
                  <FL>
                    AI agents in this flow
                    {errors.agents && <Err>{errors.agents}</Err>}
                    <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: COLORS.accent, marginLeft: 8 }}>
                      · intelligently ranked for your domain
                    </span>
                  </FL>
                  <TagInput tags={draft.agents} onChange={v => up('agents', v)} placeholder="Type or pick a suggestion…" suggestions={agentSuggestions} accentColor={editorAccent} />
                </Section>

                {/* ── KPIs ── */}
                <Section title="KPIs (optional)">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {draft.kpis.map((kpi, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 68px', gap: 6, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '8px 10px' }}>
                        <div>
                          <div style={{ fontFamily: 'monospace', fontSize: 8, color: COLORS.textMuted, marginBottom: 3 }}>LABEL</div>
                          <input value={kpi.l} onChange={e => { const k=[...draft.kpis]; k[i]={...k[i],l:e.target.value}; up('kpis',k) }} placeholder="Metric name" style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.text, background: 'transparent', border: 'none', outline: 'none', width: '100%' }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: 'monospace', fontSize: 8, color: COLORS.textMuted, marginBottom: 3 }}>VALUE</div>
                          <input value={kpi.v} onChange={e => { const k=[...draft.kpis]; k[i]={...k[i],v:e.target.value}; up('kpis',k) }} placeholder="42.3M" style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.text, background: 'transparent', border: 'none', outline: 'none', width: '100%' }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: 'monospace', fontSize: 8, color: COLORS.textMuted, marginBottom: 3 }}>DELTA</div>
                          <input value={kpi.d} onChange={e => { const k=[...draft.kpis]; k[i]={...k[i],d:e.target.value}; up('kpis',k) }} placeholder="+12%" style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.accent3, background: 'transparent', border: 'none', outline: 'none', width: '100%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* ── Actions ── */}
                <div style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
                  <button onClick={handleSave} style={{ flex: 1, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: COLORS.accent2, background: `${COLORS.accent2}12`, border: `1px solid ${COLORS.accent2}`, borderRadius: 8, padding: '11px', cursor: 'pointer' }}>
                    ✓ Save Changes
                  </button>
                  <button onClick={() => { setDraft(null); setErrors({}) }} style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: COLORS.textMuted, background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '11px 20px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  {draft.mode === 'builtin' && ovMap.has(`${draft.builtinCatKey}::${draft.builtinFlowKey}`) && (
                    <button onClick={handleResetBuiltin} style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: COLORS.accentDanger, background: `${COLORS.accentDanger}10`, border: `1px solid ${COLORS.accentDanger}44`, borderRadius: 8, padding: '11px 16px', cursor: 'pointer' }}>
                      ↺ Reset to Default
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarHeader({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ padding: '4px 16px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.textMuted }}>{label}</span>
      <span style={{ fontFamily: 'monospace', fontSize: 8, color: COLORS.textMuted, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '0 5px' }}>{count}</span>
    </div>
  )
}

function CatLabel({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div style={{ padding: '4px 16px 3px', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, display: 'flex', alignItems: 'center', gap: 5 }}>
      {icon} {label}
    </div>
  )
}

function FlowRow({ icon, label, meta, metaColor, active, activeColor, onClick, onDelete, deleteConfirm, onDeleteConfirm, onDeleteCancel }: {
  icon: string; label: string; meta: string; metaColor: string
  active: boolean; activeColor: string
  onClick: () => void
  onDelete?: () => void
  deleteConfirm?: boolean
  onDeleteConfirm?: () => void
  onDeleteCancel?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 16px', cursor: 'pointer',
        background: active ? `${activeColor}14` : 'transparent',
        borderLeft: `2px solid ${active ? activeColor : 'transparent'}`,
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = COLORS.bgCard }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.text, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: metaColor }}>{meta}</div>
      </div>
      {onDelete && (
        deleteConfirm ? (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onMouseDown={e => { e.stopPropagation(); onDeleteConfirm?.() }} style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.accentDanger, background: `${COLORS.accentDanger}18`, border: `1px solid ${COLORS.accentDanger}44`, borderRadius: 3, padding: '2px 6px', cursor: 'pointer' }}>Yes</button>
            <button onMouseDown={e => { e.stopPropagation(); onDeleteCancel?.() }} style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted, background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 3, padding: '2px 6px', cursor: 'pointer' }}>No</button>
          </div>
        ) : (
          <button onMouseDown={e => { e.stopPropagation(); onDelete() }} style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.45, flexShrink: 0 }}>🗑</button>
        )
      )}
    </div>
  )
}

function WelcomeState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 36, opacity: 0.2 }}>✎</div>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: COLORS.textDim, fontWeight: 700 }}>Select a flow to edit</div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted, maxWidth: 360, lineHeight: 1.7 }}>
        Click any built-in flow to customise its name, icon, description, datasets, agents, and KPIs. Changes can be reset to defaults at any time.
      </div>
      <button onClick={onNew} style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: COLORS.accent2, background: `${COLORS.accent2}12`, border: `1px solid ${COLORS.accent2}55`, borderRadius: 8, padding: '10px 24px', cursor: 'pointer', marginTop: 8 }}>
        ⊕ Create New Custom Flow
      </button>
    </div>
  )
}
