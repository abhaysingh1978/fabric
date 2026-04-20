import { memo } from 'react'
import { COLORS } from '@lib/theme'
import type { ETLConfig } from '@types/index'

interface ETLPipelineProps {
  running: boolean
  activeStage: number
  etlConfig: ETLConfig
}

const STAGES = ['Extract', 'Validate', 'Transform', 'Aggregate', 'Load', 'Index']

export const ETLPipeline = memo(function ETLPipeline({ running, activeStage, etlConfig }: ETLPipelineProps) {
  return (
    <>
      <style>{`
        @keyframes stage-pulse {
          0%, 100% { box-shadow: 0 0 0 0 #00D4FF44; }
          50% { box-shadow: 0 0 0 6px #00D4FF00; }
        }
      `}</style>
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '20px 24px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STAGES.map((stage, i) => {
            const isDone   = running && i < activeStage
            const isActive = running && i === activeStage
            const circleColor = isDone ? COLORS.accent3 : isActive ? COLORS.accent : COLORS.textMuted
            const lineColor   = isDone ? COLORS.accent3 : COLORS.border

            return (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: i < STAGES.length - 1 ? 1 : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: `2px solid ${circleColor}`,
                    background: isActive ? `${COLORS.accent}22` : isDone ? `${COLORS.accent3}22` : COLORS.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: circleColor,
                    transition: 'all 0.4s',
                    animation: isActive ? 'stage-pulse 1.4s ease-in-out infinite' : 'none',
                    flexShrink: 0,
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: circleColor,
                    fontWeight: isActive ? 700 : 400,
                    transition: 'color 0.4s',
                    whiteSpace: 'nowrap',
                  }}>
                    {stage}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    background: lineColor,
                    transition: 'background 0.4s',
                    marginBottom: 22,
                    minWidth: 8,
                  }} />
                )}
              </div>
            )
          })}
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: COLORS.textMuted,
          marginTop: 4,
          letterSpacing: '0.03em',
        }}>
          batch={etlConfig.batchSize.toLocaleString()} · interval={etlConfig.refreshInterval}s · agents={etlConfig.parallelAgents} · {etlConfig.streamProcessor} → {etlConfig.dataWarehouse} → {etlConfig.vectorStore}
        </div>
      </div>
    </>
  )
})
