import { COLORS } from '@lib/theme'
import { AI_MODELS } from '@data/models'
import { ETL_OPTIONS } from '@data/etlConfig'
import type { AIModel, ETLConfig } from '@types/index'

interface ConfigModalProps {
  open: boolean
  onClose: () => void
  model: AIModel
  setModel: (m: AIModel) => void
  etlConfig: ETLConfig
  setEtlConfig: (c: ETLConfig) => void
}

const ETL_LABELS: Record<keyof ETLConfig, string> = {
  batchSize:       'Batch Size',
  refreshInterval: 'Refresh Interval (s)',
  parallelAgents:  'Parallel Agents',
  vectorStore:     'Vector Store',
  dataWarehouse:   'Data Warehouse',
  streamProcessor: 'Stream Processor',
}

export function ConfigModal({ open, onClose, model, setModel, etlConfig, setEtlConfig }: ConfigModalProps) {
  if (!open) return null

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleEtlChange(key: keyof ETLConfig, val: string) {
    const numeric = ['batchSize', 'refreshInterval', 'parallelAgents']
    setEtlConfig({ ...etlConfig, [key]: numeric.includes(key) ? Number(val) : val })
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
        width: 600,
        maxHeight: '85vh',
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

        {/* Model selection */}
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
            AI Model
          </div>
          {[
            { group: 'LOCAL', models: AI_MODELS.local, badgeColor: COLORS.accent3 },
            { group: 'CLOUD', models: AI_MODELS.cloud, badgeColor: COLORS.accent2 },
          ].map(({ group, models, badgeColor }) => (
            <div key={group} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  color: badgeColor, background: `${badgeColor}22`,
                  border: `1px solid ${badgeColor}44`, borderRadius: 3,
                  padding: '2px 7px', letterSpacing: '0.08em',
                }}>{group}</span>
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
                        borderRadius: 6,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
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

        {/* ETL config */}
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
            ETL Infrastructure
          </div>
          {(Object.keys(ETL_LABELS) as Array<keyof ETLConfig>).map((key, i, arr) => (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? `0.5px solid ${COLORS.border}` : 'none',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim }}>{ETL_LABELS[key]}</span>
              <select
                value={String(etlConfig[key])}
                onChange={e => handleEtlChange(key, e.target.value)}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: COLORS.text,
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 5,
                  padding: '4px 8px',
                  cursor: 'pointer',
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
          onClick={onClose}
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.accent,
            background: `${COLORS.accent}14`,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: 8,
            padding: '12px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          ✓ Save Configuration
        </button>
      </div>
    </div>
  )
}
