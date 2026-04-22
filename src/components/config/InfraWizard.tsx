import { useState, useEffect } from 'react'
import { COLORS } from '@lib/theme'
import { INFRA_DEFS, type InfraField } from '@data/infraConfig'
import { getInfraConfig, saveInfraConfig, type InfraValues } from '@lib/infraKeys'

interface InfraWizardProps {
  service: string
  onClose: () => void
  // Controlled mode: when provided, wizard is a pure editor (no localStorage save)
  initialValues?: Record<string, string>
  onSave?: (values: Record<string, string>) => void
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail'

function groupBySection(fields: InfraField[]): Array<{ section: string; fields: InfraField[] }> {
  const map = new Map<string, InfraField[]>()
  for (const f of fields) {
    const arr = map.get(f.section) ?? []
    arr.push(f)
    map.set(f.section, arr)
  }
  return Array.from(map.entries()).map(([section, fields]) => ({ section, fields }))
}

export function InfraWizard({ service, onClose, initialValues, onSave }: InfraWizardProps) {
  const def = INFRA_DEFS[service]
  if (!def) return null

  const controlled = onSave !== undefined
  const sections = groupBySection(def.fields)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<InfraValues>({})
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [testState, setTestState] = useState<TestState>('idle')
  const [saved, setSaved] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    setValues(controlled ? (initialValues ?? {}) : getInfraConfig(service))
    setStep(0)
    setTestState('idle')
    setSaved(false)
    setShowGuide(false)
  }, [service])

  const currentSection = sections[step]
  const currentGuide = def.guide[currentSection.section]
  const isFirst = step === 0
  const isLast = step === sections.length - 1

  function set(key: string, val: string) {
    setValues(v => ({ ...v, [key]: val }))
    setTestState('idle')
    setSaved(false)
  }

  function toggleVisible(key: string) {
    setVisible(v => ({ ...v, [key]: !v[key] }))
  }

  function handleTestConnection() {
    setTestState('testing')
    setTimeout(() => setTestState('ok'), 1400)
  }

  function handleSave() {
    if (controlled) {
      onSave!(values)
    } else {
      saveInfraConfig(service, values)
    }
    setSaved(true)
    setTimeout(onClose, 700)
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const filledCount = def.fields.filter(f => (values[f.key] ?? '').trim()).length

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1100,
      }}
    >
      <div style={{
        width: showGuide ? 900 : 520,
        maxWidth: '96vw',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'row',
        background: COLORS.bgPanel,
        border: `1px solid ${def.color}55`,
        borderRadius: 14,
        boxShadow: `0 0 48px ${def.color}22`,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
      }}>

        {/* ── Left: Configure pane ─────────────────────────────────────── */}
        <div style={{ flex: '0 0 520px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Header */}
          <div style={{
            background: `${def.color}18`,
            borderBottom: `1px solid ${def.color}33`,
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${def.color}22`, border: `1px solid ${def.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {def.category === 'Vector Store' ? '⚡' : def.category === 'Data Warehouse' ? '🏛' : '⚙'}
              </div>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: COLORS.text }}>
                  {def.name}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: def.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
                  {def.category}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {filledCount > 0 && (
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, color: COLORS.accent3,
                  background: `${COLORS.accent3}18`, border: `1px solid ${COLORS.accent3}44`,
                  borderRadius: 4, padding: '2px 7px',
                }}>
                  {filledCount}/{def.fields.length}
                </span>
              )}
              <button
                onClick={() => setShowGuide(g => !g)}
                title={showGuide ? 'Hide guide' : 'Show setup guide'}
                style={{
                  fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                  color: showGuide ? def.color : COLORS.textDim,
                  background: showGuide ? `${def.color}18` : COLORS.bgCard,
                  border: `1px solid ${showGuide ? def.color + '66' : COLORS.border}`,
                  borderRadius: 5, padding: '4px 10px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ? Help
              </button>
              <button
                onClick={onClose}
                style={{
                  fontFamily: 'monospace', fontSize: 14, color: COLORS.textMuted,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  lineHeight: 1, padding: '2px 4px',
                }}
              >✕</button>
            </div>
          </div>

          {/* Step indicators */}
          {sections.length > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '14px 20px 0',
              flexShrink: 0,
            }}>
              {sections.map((s, i) => {
                const done = i < step
                const active = i === step
                const sectionFilled = s.fields.every(f => (values[f.key] ?? '').trim())
                return (
                  <div key={s.section} style={{ display: 'flex', alignItems: 'center', flex: i < sections.length - 1 ? 1 : 'none' }}>
                    <button
                      onClick={() => setStep(i)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                      }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                        background: active ? def.color : done ? `${def.color}33` : COLORS.bgCard,
                        border: `1.5px solid ${active ? def.color : done ? def.color + '88' : COLORS.border}`,
                        color: active ? '#fff' : done ? def.color : COLORS.textMuted,
                        transition: 'all 0.2s',
                      }}>
                        {done && sectionFilled ? '✓' : i + 1}
                      </div>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 9, fontWeight: active ? 700 : 400,
                        color: active ? def.color : COLORS.textMuted, whiteSpace: 'nowrap',
                      }}>
                        {s.section}
                      </div>
                    </button>
                    {i < sections.length - 1 && (
                      <div style={{
                        flex: 1, height: 1.5, marginBottom: 18, marginLeft: 6, marginRight: 6,
                        background: done ? `${def.color}66` : COLORS.border,
                        transition: 'background 0.3s',
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Fields */}
          <div style={{
            padding: '18px 20px',
            display: 'flex', flexDirection: 'column', gap: 14,
            overflowY: 'auto', flex: 1,
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: def.color, marginBottom: -4,
            }}>
              {currentSection.section}
            </div>

            {currentSection.fields.map(field => {
              const val = values[field.key] ?? ''
              const isPassword = field.type === 'password'
              const show = visible[field.key]

              return (
                <div key={field.key}>
                  <label style={{
                    fontFamily: 'monospace', fontSize: 10, color: COLORS.textDim,
                    display: 'block', marginBottom: 5,
                  }}>
                    {field.label}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={val}
                      onChange={e => set(field.key, e.target.value)}
                      style={{
                        width: '100%', fontFamily: 'monospace', fontSize: 11,
                        color: val ? COLORS.text : COLORS.textMuted,
                        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                        borderRadius: 6, padding: '8px 10px', outline: 'none', cursor: 'pointer',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = def.color }}
                      onBlur={e => { e.currentTarget.style.borderColor = COLORS.border }}
                    >
                      <option value="">— select —</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>

                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={val}
                      onChange={e => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      spellCheck={false}
                      style={{
                        width: '100%', fontFamily: 'monospace', fontSize: 10,
                        color: val ? COLORS.text : COLORS.textMuted,
                        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                        borderRadius: 6, padding: '8px 10px', outline: 'none', resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = def.color }}
                      onBlur={e => { e.currentTarget.style.borderColor = COLORS.border }}
                    />

                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type={isPassword && !show ? 'password' : 'text'}
                        value={val}
                        onChange={e => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        spellCheck={false}
                        style={{
                          flex: 1, fontFamily: 'monospace', fontSize: 11,
                          color: val ? COLORS.text : COLORS.textMuted,
                          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                          borderRadius: 6, padding: '8px 10px', outline: 'none',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = def.color }}
                        onBlur={e => { e.currentTarget.style.borderColor = COLORS.border }}
                      />
                      {isPassword && (
                        <button
                          onClick={() => toggleVisible(field.key)}
                          style={{
                            fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted,
                            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                            borderRadius: 6, padding: '0 10px', cursor: 'pointer', flexShrink: 0,
                          }}
                        >
                          {show ? '🙈' : '👁'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Inline hint */}
                  {field.hint && (
                    <div style={{
                      fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted,
                      marginTop: 4, paddingLeft: 2,
                    }}>
                      ↳ {field.hint}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: `1px solid ${COLORS.border}`,
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            flexShrink: 0,
          }}>
            {isLast ? (
              <button
                onClick={handleTestConnection}
                disabled={testState === 'testing'}
                style={{
                  fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                  color: testState === 'ok' ? COLORS.accent3 : testState === 'fail' ? COLORS.accentDanger : COLORS.textDim,
                  background: COLORS.bg,
                  border: `1px solid ${testState === 'ok' ? COLORS.accent3 : testState === 'fail' ? COLORS.accentDanger : COLORS.border}`,
                  borderRadius: 6, padding: '7px 14px', cursor: testState === 'testing' ? 'wait' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {testState === 'idle'    && '⚡ Test Connection'}
                {testState === 'testing' && '◌ Testing…'}
                {testState === 'ok'      && '✓ Connected'}
                {testState === 'fail'    && '✗ Failed'}
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              {!isFirst && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                    color: COLORS.textDim, background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6, padding: '8px 16px', cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
              )}
              {!isLast && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                    color: def.color, background: `${def.color}18`,
                    border: `1px solid ${def.color}66`,
                    borderRadius: 6, padding: '8px 18px', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Next →
                </button>
              )}
              {isLast && (
                <button
                  onClick={handleSave}
                  style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                    color: saved ? COLORS.accent3 : '#fff',
                    background: saved ? `${COLORS.accent3}22` : def.color,
                    border: `1px solid ${saved ? COLORS.accent3 : def.color}`,
                    borderRadius: 6, padding: '8px 20px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {saved ? '✓ Saved' : '✓ Save'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Guide pane ────────────────────────────────────────── */}
        {showGuide && (
          <div style={{
            flex: 1,
            borderLeft: `1px solid ${def.color}33`,
            display: 'flex', flexDirection: 'column',
            background: `${def.color}08`,
            minWidth: 0,
            overflowY: 'auto',
          }}>

            {/* Guide header */}
            <div style={{
              padding: '16px 20px 12px',
              borderBottom: `1px solid ${def.color}22`,
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                color: def.color, marginBottom: 2,
              }}>
                Setup Guide
              </div>
              <div style={{
                fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {currentSection.section} · {def.name}
              </div>
            </div>

            {currentGuide ? (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Overview */}
                <div style={{
                  fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim,
                  lineHeight: 1.65,
                  padding: '10px 12px',
                  background: `${def.color}12`,
                  border: `1px solid ${def.color}30`,
                  borderRadius: 7,
                }}>
                  {currentGuide.overview}
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {currentGuide.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: `${def.color}22`, border: `1px solid ${def.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: def.color,
                        marginTop: 1,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim,
                        lineHeight: 1.6, flex: 1,
                      }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Links */}
                {currentGuide.links.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                      fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: COLORS.textMuted, marginBottom: 2,
                    }}>
                      Resources
                    </div>
                    {currentGuide.links.map(link => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontFamily: 'monospace', fontSize: 10,
                          color: def.color, textDecoration: 'none',
                          padding: '6px 10px',
                          background: `${def.color}10`,
                          border: `1px solid ${def.color}30`,
                          borderRadius: 6,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${def.color}22` }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${def.color}10` }}
                      >
                        <span style={{ fontSize: 11 }}>↗</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Other sections navigator */}
                {sections.length > 1 && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{
                      fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: COLORS.textMuted, marginBottom: 8,
                    }}>
                      Other Sections
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {sections.map((s, i) => (
                        <button
                          key={s.section}
                          onClick={() => setStep(i)}
                          style={{
                            fontFamily: 'monospace', fontSize: 9, fontWeight: i === step ? 700 : 400,
                            color: i === step ? def.color : COLORS.textMuted,
                            background: i === step ? `${def.color}18` : COLORS.bgCard,
                            border: `1px solid ${i === step ? def.color + '66' : COLORS.border}`,
                            borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {s.section}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted }}>
                No guide available for this section.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
