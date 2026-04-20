import { COLORS } from '@lib/theme'
import type { UseCase, ETLConfig, AIModel } from '@types/index'

interface ArchitectureBarProps {
  activeCase: UseCase
  etlConfig: ETLConfig
  model: AIModel
}

const CELLS = [
  { label: 'Data Sources',   icon: '⊞', color: '#00D4FF' },
  { label: 'Stream Layer',   icon: '⟳', color: '#F59E0B' },
  { label: 'Warehouse',      icon: '⊟', color: '#8B5CF6' },
  { label: 'Vector Store',   icon: '⊕', color: '#10B981' },
  { label: 'AI Agents',      icon: '⊛', color: '#EC4899' },
  { label: 'AI Model',       icon: '◈', color: '#FF8C61' },
]

export function ArchitectureBar({ activeCase, etlConfig, model }: ArchitectureBarProps) {
  const values = [
    `${activeCase.datasets.length} feeds`,
    etlConfig.streamProcessor,
    etlConfig.dataWarehouse,
    etlConfig.vectorStore,
    `${activeCase.agents.length} agents`,
    model.name,
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 8,
      padding: '0 24px 12px',
    }}>
      {CELLS.map((cell, i) => (
        <div key={cell.label} style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderTop: `2px solid ${cell.color}`,
          borderRadius: 6,
          padding: '8px 10px',
          minWidth: 0,
        }}>
          <div style={{
            fontSize: 9,
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 4,
          }}>
            {cell.icon} {cell.label}
          </div>
          <div style={{
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: cell.color,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {values[i]}
          </div>
        </div>
      ))}
    </div>
  )
}
