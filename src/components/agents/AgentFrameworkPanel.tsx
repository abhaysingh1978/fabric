import { COLORS } from '@lib/theme'
import { AgentBubble } from '@components/shared/AgentBubble'

interface AgentFrameworkPanelProps {
  agents: string[]
  activeAgents: number[]
  running: boolean
}

const AGENT_COLORS = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899']

export function AgentFrameworkPanel({ agents, activeAgents, running }: AgentFrameworkPanelProps) {
  const activeCount = running ? activeAgents.length : 0

  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: COLORS.textMuted,
      }}>
        Multi-Agent Framework · A2A Communication
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {agents.map((name, i) => (
          <AgentBubble
            key={name}
            name={name}
            active={running && activeAgents.includes(i)}
            color={AGENT_COLORS[i % 5]}
          />
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'monospace',
        fontSize: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.textMuted }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: running ? COLORS.accentWarn : COLORS.textMuted,
          }} />
          A2A messages flowing between active agents
        </div>
        <div style={{ color: COLORS.accent, fontWeight: 700 }}>
          {activeCount}/{agents.length} active
        </div>
      </div>
    </div>
  )
}
