import { useState } from 'react'
import { COLORS } from '@lib/theme'
import { AI_MODELS } from '@data/models'
import { ETL_OPTIONS } from '@data/etlConfig'
import { getAPIKeys, saveAPIKeys, type APIKeys } from '@lib/apiKeys'
import { isInfraConfigured } from '@lib/infraKeys'
import { InfraWizard } from './InfraWizard'
import { ProviderSetupGuide } from './ProviderSetupGuide'
import { DataSourceManager } from './DataSourceManager'
import type { AIModel, ETLConfig } from '@types/index'

interface ConfigModalProps {
  open: boolean
  onClose: () => void
  model: AIModel
  setModel: (m: AIModel) => void
  etlConfig: ETLConfig
  setEtlConfig: (c: ETLConfig) => void
}

// Explicit groups — order controls render order in each section
const PIPELINE_KEYS: Array<{ key: keyof ETLConfig; label: string }> = [
  { key: 'batchSize',       label: 'Batch Size' },
  { key: 'refreshInterval', label: 'Refresh Interval (s)' },
  { key: 'parallelAgents',  label: 'Parallel Agents' },
]

const INFRA_KEYS: Array<{ key: keyof ETLConfig; label: string }> = [
  { key: 'vectorStore',     label: 'Vector Store' },
  { key: 'dataWarehouse',   label: 'Data Warehouse' },
  { key: 'streamProcessor', label: 'Stream Processor' },
]

const PROVIDER_ROWS: Array<{
  key: keyof APIKeys
  label: string
  placeholder: string
  color: string
  isUrl?: boolean
}> = [
  { key: 'anthropic', label: 'Anthropic',  placeholder: 'sk-ant-api03-…',          color: '#FF8C61' },
  { key: 'google',    label: 'Google AI',  placeholder: 'AIzaSy…',                  color: '#4285F4' },
  { key: 'openai',    label: 'OpenAI',     placeholder: 'sk-proj-…',                color: '#74AA9C' },
  { key: 'ollama',    label: 'Ollama URL', placeholder: 'http://localhost:11434',    color: '#8B5CF6', isUrl: true },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: COLORS.border }} />
}

export function ConfigModal({ open, onClose, model, setModel, etlConfig, setEtlConfig }: ConfigModalProps) {
  const [keys, setKeys] = useState<APIKeys>(getAPIKeys)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [showSourceManager, setShowSourceManager] = useState(false)
  const [wizardService, setWizardService] = useState<string | null>(null)
  const [infraVersion, setInfraVersion] = useState(0) // bumped after wizard close to refresh configured badges
  void infraVersion
  const [guideTab, setGuideTab] = useState<string | null>(null)

  if (!open) return null

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) handleSave()
  }

  function handleEtlChange(key: keyof ETLConfig, val: string) {
    const numeric = ['batchSize', 'refreshInterval', 'parallelAgents']
    setEtlConfig({ ...etlConfig, [key]: numeric.includes(key) ? Number(val) : val })
  }

  function handleSave() {
    saveAPIKeys(keys)
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 600)
  }

  function toggleVisible(key: string) {
    setVisible(v => ({ ...v, [key]: !v[key] }))
  }

  function isKeySet(val: string) { return val.length > 0 }

  function maskValue(val: string) {
    if (!val) return ''
    if (val.length <= 8) return '•'.repeat(val.length)
    return val.slice(0, 6) + '•'.repeat(Math.min(val.length - 8, 20)) + val.slice(-4)
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{
        width: 620,
        maxHeight: '88vh',
        overflowY: 'auto',
        background: COLORS.bgPanel,
        border: `1px solid ${COLORS.borderBright}`,
        borderRadius: 12,
        boxShadow: `0 0 40px ${COLORS.accent}22`,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: COLORS.text }}>
          Configuration
        </div>

        {/* API Keys */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted }}>
              API Keys
            </div>
            <button
              onClick={() => setGuideTab('anthropic')}
              style={{
                fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                color: COLORS.accent, background: `${COLORS.accent}10`,
                border: `1px solid ${COLORS.accent}44`,
                borderRadius: 5, padding: '3px 10px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              ? How to get keys
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PROVIDER_ROWS.map((row, i) => {
              const val = keys[row.key]
              const show = visible[row.key]
              const set = isKeySet(val)
              return (
                <div key={row.key} style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr auto auto',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: i < PROVIDER_ROWS.length - 1 ? `0.5px solid ${COLORS.border}` : 'none',
                }}>
                  {/* Label + status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: set ? row.color : COLORS.border,
                      boxShadow: set ? `0 0 5px ${row.color}88` : 'none',
                    }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim }}>{row.label}</span>
                  </div>

                  {/* Input */}
                  <input
                    type={show || row.isUrl ? 'text' : 'password'}
                    value={val}
                    onChange={e => setKeys(k => ({ ...k, [row.key]: e.target.value }))}
                    placeholder={row.placeholder}
                    spellCheck={false}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: set ? COLORS.text : COLORS.textMuted,
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 5,
                      padding: '6px 10px',
                      outline: 'none',
                      width: '100%',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = row.color }}
                    onBlur={e => { e.currentTarget.style.borderColor = COLORS.border }}
                  />

                  {/* Show/hide toggle (not for URL) */}
                  {!row.isUrl ? (
                    <button
                      onClick={() => toggleVisible(row.key)}
                      title={show ? 'Hide' : 'Show'}
                      style={{
                        fontFamily: 'monospace', fontSize: 10,
                        color: COLORS.textMuted, background: 'transparent',
                        border: `1px solid ${COLORS.border}`, borderRadius: 4,
                        padding: '4px 8px', cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      {show ? '🙈' : '👁'}
                    </button>
                  ) : <div />}

                  {/* Clear button */}
                  <button
                    onClick={() => setKeys(k => ({ ...k, [row.key]: '' }))}
                    disabled={!set}
                    title="Clear"
                    style={{
                      fontFamily: 'monospace', fontSize: 10,
                      color: set ? COLORS.accentDanger : COLORS.border,
                      background: 'transparent',
                      border: `1px solid ${set ? COLORS.accentDanger + '55' : COLORS.border}`,
                      borderRadius: 4, padding: '4px 8px',
                      cursor: set ? 'pointer' : 'default', flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted, marginTop: 8 }}>
            Keys are stored in browser localStorage. Env vars (.env) are used as fallback.
          </div>
        </div>

        <Divider />

        {/* Model selection */}
        <div>
          <SectionLabel>AI Model</SectionLabel>
          {[
            { group: 'LOCAL', models: AI_MODELS.local, badgeColor: COLORS.accent3, guideId: 'ollama', guideLabel: '? Local setup' },
            { group: 'CLOUD', models: AI_MODELS.cloud, badgeColor: COLORS.accent2, guideId: 'anthropic', guideLabel: '? Cloud API keys' },
          ].map(({ group, models, badgeColor, guideId, guideLabel }) => (
            <div key={group} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  color: badgeColor, background: `${badgeColor}22`,
                  border: `1px solid ${badgeColor}44`, borderRadius: 3,
                  padding: '2px 7px', letterSpacing: '0.08em',
                }}>{group}</span>
                <button
                  onClick={() => setGuideTab(guideId)}
                  style={{
                    fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                    color: badgeColor, background: `${badgeColor}10`,
                    border: `1px solid ${badgeColor}44`,
                    borderRadius: 5, padding: '3px 10px', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {guideLabel}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {models.map(m => {
                  const selected = model.id === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setModel(m)}
                      style={{
                        fontFamily: 'monospace',
                        background: selected ? `${m.color}22` : COLORS.bgCard,
                        border: `1px solid ${selected ? m.color : COLORS.border}`,
                        borderRadius: 6, padding: '8px 12px',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: selected ? m.color : COLORS.text }}>{m.name}</div>
                      <div style={{ fontSize: 9, color: COLORS.textMuted }}>{m.provider} · {m.tag}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Data Sources */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted }}>
              Data Sources
            </div>
            <button
              onClick={() => setShowSourceManager(true)}
              style={{
                fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                color: COLORS.accent2, background: `${COLORS.accent2}10`,
                border: `1px solid ${COLORS.accent2}44`,
                borderRadius: 5, padding: '3px 10px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Manage Sources ›
            </button>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, lineHeight: 1.6 }}>
            Configure per-flow data sources: databases, files, APIs, streams, and SaaS connectors.
            Each flow can have its own set of independently configured sources.
          </div>
        </div>

        <Divider />

        {/* ETL Infrastructure */}
        <div>
          <SectionLabel>ETL Infrastructure</SectionLabel>
          {INFRA_KEYS.map(({ key, label }, i, arr) => {
            const currentService = String(etlConfig[key])
            const configured = isInfraConfigured(currentService)
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? `0.5px solid ${COLORS.border}` : 'none',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim, flexShrink: 0 }}>
                  {label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                  <select
                    value={currentService}
                    onChange={e => handleEtlChange(key, e.target.value)}
                    style={{
                      fontFamily: 'monospace', fontSize: 11, color: COLORS.text,
                      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                      borderRadius: 5, padding: '4px 8px', cursor: 'pointer',
                    }}
                  >
                    {ETL_OPTIONS[key].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setWizardService(currentService)}
                    style={{
                      fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                      color: configured ? COLORS.accent3 : COLORS.accent,
                      background: configured ? `${COLORS.accent3}14` : `${COLORS.accent}14`,
                      border: `1px solid ${configured ? COLORS.accent3 + '66' : COLORS.accent + '66'}`,
                      borderRadius: 5, padding: '4px 10px', cursor: 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s',
                    }}
                  >
                    {configured ? '✓ Configured' : 'Configure ›'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <Divider />

        {/* Pipeline Settings */}
        <div>
          <SectionLabel>Pipeline Settings</SectionLabel>
          {PIPELINE_KEYS.map(({ key, label }, i, arr) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? `0.5px solid ${COLORS.border}` : 'none',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim, flexShrink: 0 }}>
                {label}
              </span>
              <select
                value={String(etlConfig[key])}
                onChange={e => handleEtlChange(key, e.target.value)}
                style={{
                  fontFamily: 'monospace', fontSize: 11, color: COLORS.text,
                  background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  borderRadius: 5, padding: '4px 8px', cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                {ETL_OPTIONS[key].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{
            fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
            color: saved ? COLORS.accent3 : COLORS.accent,
            background: saved ? `${COLORS.accent3}14` : `${COLORS.accent}14`,
            border: `1px solid ${saved ? COLORS.accent3 : COLORS.accent}`,
            borderRadius: 8, padding: '12px',
            cursor: 'pointer', width: '100%',
            transition: 'all 0.2s',
          }}
        >
          {saved ? '✓ Saved' : '✓ Save Configuration'}
        </button>
      </div>

      {showSourceManager && (
        <DataSourceManager onClose={() => setShowSourceManager(false)} />
      )}

      {wizardService && (
        <InfraWizard
          service={wizardService}
          onClose={() => {
            setWizardService(null)
            setInfraVersion(v => v + 1)
          }}
        />
      )}

      {guideTab && (
        <ProviderSetupGuide
          initialTab={guideTab}
          onClose={() => setGuideTab(null)}
        />
      )}
    </div>
  )
}
