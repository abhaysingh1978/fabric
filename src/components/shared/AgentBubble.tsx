import { memo } from 'react'
import { COLORS } from '@lib/theme'

interface AgentBubbleProps {
  name: string
  active: boolean
  color: string
}

export const AgentBubble = memo(function AgentBubble({ name, active, color }: AgentBubbleProps) {
  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 6,
        border: `1px solid ${active ? color : COLORS.border}`,
        background: active ? `${color}14` : COLORS.bgCard,
        boxShadow: active ? `0 0 8px ${color}44` : 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'monospace',
        fontSize: 11,
        color: active ? color : COLORS.textMuted,
        fontWeight: active ? 700 : 400,
      }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: active ? color : COLORS.textMuted,
          animation: active ? 'pulse-dot 1.2s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />
        {name}
      </div>
    </>
  )
})
