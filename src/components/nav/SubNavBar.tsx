import { COLORS } from '@lib/theme'
import type { UseCase } from '@types/index'

interface SubNavBarProps {
  category: string
  sub: string
  setSub: (s: string) => void
  subCases: Record<string, UseCase>
  categoryColor: string
}

export function SubNavBar({ sub, setSub, subCases, categoryColor }: SubNavBarProps) {
  if (Object.keys(subCases).length <= 1) return null

  return (
    <div style={{
      background: COLORS.bgPanel,
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 4,
      height: 36,
    }}>
      {Object.entries(subCases).map(([key, useCase]) => {
        const active = key === sub
        return (
          <button
            key={key}
            onClick={() => setSub(key)}
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: active ? 700 : 400,
              color: active ? categoryColor : COLORS.textMuted,
              background: active ? `${categoryColor}14` : 'transparent',
              border: `1px solid ${active ? categoryColor : 'transparent'}`,
              borderRadius: 5,
              padding: '3px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            onMouseEnter={e => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = COLORS.bgCard
            }}
            onMouseLeave={e => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            {useCase.icon} {useCase.label}
          </button>
        )
      })}
    </div>
  )
}
