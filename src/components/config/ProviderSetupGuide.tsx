import { useState } from 'react'
import { COLORS } from '@lib/theme'
import { PROVIDER_GUIDES, type ProviderGuide } from '@data/providerGuides'

interface ProviderSetupGuideProps {
  initialTab?: string   // provider id to open on
  onClose: () => void
}

export function ProviderSetupGuide({ initialTab, onClose }: ProviderSetupGuideProps) {
  const [activeId, setActiveId] = useState(
    initialTab ?? PROVIDER_GUIDES[0].id
  )
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const guide = PROVIDER_GUIDES.find(g => g.id === activeId) ?? PROVIDER_GUIDES[0]

  // All sections open by default
  function isSectionOpen(heading: string) {
    return openSections[heading] !== false
  }

  function toggleSection(heading: string) {
    setOpenSections(s => ({ ...s, [heading]: !isSectionOpen(heading) }))
  }

  // Reset section state when switching tabs
  function switchTab(id: string) {
    setActiveId(id)
    setOpenSections({})
  }

  function handleOverlay(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleOverlay}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1050,
      }}
    >
      <div style={{
        width: 820, maxWidth: '96vw',
        height: '86vh',
        display: 'flex', flexDirection: 'column',
        background: COLORS.bgPanel,
        border: `1px solid ${guide.color}44`,
        borderRadius: 14,
        boxShadow: `0 0 60px ${guide.color}18`,
        overflow: 'hidden',
      }}>

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.bgPanel,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: guide.color, boxShadow: `0 0 8px ${guide.color}`,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: COLORS.text }}>
              Setup Guide
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted }}>
              · {guide.label}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'monospace', fontSize: 14, color: COLORS.textMuted,
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 6px',
            }}
          >✕</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── Left: provider tabs ────────────────────────────────────── */}
          <div style={{
            width: 172, flexShrink: 0,
            borderRight: `1px solid ${COLORS.border}`,
            display: 'flex', flexDirection: 'column',
            padding: '12px 0',
            overflowY: 'auto',
          }}>
            {PROVIDER_GUIDES.map(g => {
              const active = g.id === activeId
              return (
                <button
                  key={g.id}
                  onClick={() => switchTab(g.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: 3, padding: '10px 16px',
                    background: active ? `${g.color}14` : 'transparent',
                    border: 'none',
                    borderLeft: `2px solid ${active ? g.color : 'transparent'}`,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: active ? 700 : 400,
                    color: active ? g.color : COLORS.textDim,
                  }}>
                    {g.label}
                  </div>
                  <div style={{
                    fontFamily: 'monospace', fontSize: 9,
                    color: active ? g.color + 'aa' : COLORS.textMuted,
                    lineHeight: 1.4,
                  }}>
                    {g.tagline}
                  </div>
                </button>
              )
            })}

            {/* Docs link */}
            <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: `1px solid ${COLORS.border}` }}>
              <a
                href={guide.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', fontFamily: 'monospace', fontSize: 9,
                  color: guide.color, textDecoration: 'none',
                  padding: '6px 8px',
                  background: `${guide.color}10`,
                  border: `1px solid ${guide.color}30`,
                  borderRadius: 5, textAlign: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${guide.color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${guide.color}10` }}
              >
                ↗ {guide.consoleLabel}
              </a>
            </div>
          </div>

          {/* ── Right: guide content ───────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

            {/* Provider header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: 'monospace', fontSize: 16, fontWeight: 700,
                color: guide.color, marginBottom: 4,
              }}>
                {guide.label}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted }}>
                {guide.tagline}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
                fontFamily: 'monospace', fontSize: 9,
                color: COLORS.textMuted,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 5, padding: '4px 10px',
              }}>
                <span>Key format:</span>
                <span style={{ color: guide.color }}>{guide.keyHint}</span>
              </div>
            </div>

            {/* Sections */}
            {guide.sections.map((section, si) => (
              <div key={section.heading} style={{ marginBottom: 16 }}>

                {/* Section header (collapsible) */}
                <button
                  onClick={() => toggleSection(section.heading)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 14px',
                    background: `${guide.color}10`,
                    border: `1px solid ${guide.color}30`,
                    borderRadius: isSectionOpen(section.heading) ? '7px 7px 0 0' : 7,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'border-radius 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: guide.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#fff',
                    }}>
                      {si + 1}
                    </div>
                    <span style={{
                      fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                      color: guide.color,
                    }}>
                      {section.heading}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: guide.color, opacity: 0.7 }}>
                    {isSectionOpen(section.heading) ? '▾' : '▸'}
                  </span>
                </button>

                {/* Steps */}
                {isSectionOpen(section.heading) && (
                  <div style={{
                    border: `1px solid ${guide.color}30`,
                    borderTop: 'none',
                    borderRadius: '0 0 7px 7px',
                    overflow: 'hidden',
                  }}>
                    {section.steps.map((step, stepIdx) => (
                      <div
                        key={stepIdx}
                        style={{
                          padding: '14px 16px',
                          borderBottom: stepIdx < section.steps.length - 1
                            ? `1px solid ${COLORS.border}`
                            : 'none',
                          background: stepIdx % 2 === 0 ? COLORS.bgCard : 'transparent',
                        }}
                      >
                        {/* Step header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: step.body ? 6 : 0 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                            background: `${guide.color}22`,
                            border: `1px solid ${guide.color}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                            color: guide.color, marginTop: 1,
                          }}>
                            {stepIdx + 1}
                          </div>
                          <div style={{
                            fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                            color: COLORS.text, lineHeight: 1.5,
                          }}>
                            {step.title}
                          </div>
                        </div>

                        {/* Body text */}
                        {step.body && (
                          <div style={{
                            fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim,
                            lineHeight: 1.65, marginLeft: 30, marginBottom: step.code || step.warn || step.tip ? 8 : 0,
                          }}>
                            {step.body}
                          </div>
                        )}

                        {/* Code block */}
                        {step.code && (
                          <div style={{
                            marginLeft: 30, marginBottom: step.warn || step.tip ? 8 : 0,
                            background: '#0d1117',
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 6,
                            padding: '10px 14px',
                            fontFamily: 'monospace', fontSize: 10,
                            color: '#a8d8a8',
                            lineHeight: 1.7,
                            whiteSpace: 'pre',
                            overflowX: 'auto',
                          }}>
                            {step.code}
                          </div>
                        )}

                        {/* Warning callout */}
                        {step.warn && (
                          <div style={{
                            marginLeft: 30, marginBottom: step.tip ? 8 : 0,
                            display: 'flex', gap: 8, alignItems: 'flex-start',
                            background: `${COLORS.accentWarn}10`,
                            border: `1px solid ${COLORS.accentWarn}44`,
                            borderRadius: 6, padding: '8px 12px',
                          }}>
                            <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>⚠</span>
                            <span style={{
                              fontFamily: 'monospace', fontSize: 10,
                              color: COLORS.accentWarn, lineHeight: 1.6,
                            }}>
                              {step.warn}
                            </span>
                          </div>
                        )}

                        {/* Tip callout */}
                        {step.tip && (
                          <div style={{
                            marginLeft: 30,
                            display: 'flex', gap: 8, alignItems: 'flex-start',
                            background: `${COLORS.accent3}10`,
                            border: `1px solid ${COLORS.accent3}44`,
                            borderRadius: 6, padding: '8px 12px',
                          }}>
                            <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>💡</span>
                            <span style={{
                              fontFamily: 'monospace', fontSize: 10,
                              color: COLORS.accent3, lineHeight: 1.6,
                              whiteSpace: 'pre-line',
                            }}>
                              {step.tip}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Docs footer */}
            <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
              <a
                href={guide.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'monospace', fontSize: 10,
                  color: guide.color, textDecoration: 'none',
                  padding: '7px 14px',
                  background: `${guide.color}10`,
                  border: `1px solid ${guide.color}30`,
                  borderRadius: 6,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${guide.color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${guide.color}10` }}
              >
                <span>↗</span>
                Official {guide.label} documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
