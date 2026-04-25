import { useCallback } from 'react'
import { COLORS } from '@lib/theme'
import type { AIModel, Category } from '@types/index'
import { DEMOS } from '@data/usecases'

interface TopNavBarProps {
  category: string
  setCategory: (cat: string) => void
  configOpen: boolean
  setConfigOpen: (open: boolean) => void
  onManageFlows: () => void
  model: AIModel
  categories: Record<string, Category>
}

export function TopNavBar({ category, setCategory, setConfigOpen, onManageFlows, model, categories }: TopNavBarProps) {
  const handleCategoryClick = useCallback((key: string) => {
    setCategory(key)
  }, [setCategory])

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      height: 54,
      background: COLORS.bg,
      borderBottom: `1px solid ${COLORS.border}`,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 28 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#fff', fontWeight: 900,
        }}>◈</div>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: COLORS.text, letterSpacing: '0.12em' }}>AETHON</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: COLORS.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ETL · AI · MULTI-AGENT PLATFORM
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        {Object.entries(categories).map(([key, cat]) => {
          const active = key === category
          return (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: active ? 700 : 400,
                color: active ? cat.color : COLORS.textMuted,
                background: active ? `${cat.color}18` : 'transparent',
                border: `1px solid ${active ? cat.color : 'transparent'}`,
                borderRadius: 6,
                padding: '5px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = `${COLORS.bgCard}`
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              {cat.icon} {cat.label}
            </button>
          )
        })}
      </div>

      {/* Right: model + flows + config */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: model.color,
            boxShadow: `0 0 5px ${model.color}`,
          }} />
          <span style={{ color: model.color, fontWeight: 700 }}>{model.name}</span>
          <span style={{ color: COLORS.textMuted }}>· {model.tag}</span>
        </div>
        <button
          onClick={onManageFlows}
          style={{
            fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
            color: COLORS.accent2,
            background: `${COLORS.accent2}12`,
            border: `1px solid ${COLORS.accent2}44`,
            borderRadius: 6, padding: '5px 12px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          ⊕ Flows
        </button>
        <button
          onClick={() => setConfigOpen(true)}
          style={{
            fontFamily: 'monospace',
            fontSize: 10,
            color: COLORS.textDim,
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: '5px 12px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          ⚙ Config
        </button>
      </div>
    </div>
  )
}

// Re-export DEMOS so App can pass categories
export { DEMOS }
