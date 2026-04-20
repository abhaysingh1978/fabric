import { COLORS } from '@lib/theme'

interface KPICardProps {
  label: string
  value: string
  delta?: string
}

function isDeltaPositive(d: string) {
  return d.startsWith('+') || d === 'Live' || d === 'Auto'
}

export function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: COLORS.textMuted,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 22,
        fontWeight: 700,
        color: COLORS.text,
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: isDeltaPositive(delta) ? COLORS.accent3 : COLORS.textDim,
          fontWeight: 600,
        }}>
          {delta}
        </div>
      )}
    </div>
  )
}
