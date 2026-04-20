import { useEffect, useCallback } from 'react'
import { COLORS } from '@lib/theme'
import { usePipeline } from '@hooks/usePipeline'
import { KPICard } from '@components/shared/KPICard'
import { Badge } from '@components/shared/Badge'
import { ETLPipeline } from '@components/pipeline/ETLPipeline'
import { LogTerminal } from '@components/pipeline/LogTerminal'
import { AgentFrameworkPanel } from '@components/agents/AgentFrameworkPanel'
import { BFSICharts } from '@components/charts/BFSICharts'
import { SalesCharts } from '@components/charts/SalesCharts'
import { EconomyCharts } from '@components/charts/EconomyCharts'
import { AIQueryPanel } from '@components/ai/AIQueryPanel'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import type { UseCase, ETLConfig, AIModel } from '@types/index'

interface DemoPanelProps {
  caseKey: string
  useCase: UseCase
  model: AIModel
  etlConfig: ETLConfig
}

function ChartSection({ caseKey }: { caseKey: string }) {
  if (caseKey === 'stock' || caseKey === 'advisory' || caseKey === 'fund')
    return <ErrorBoundary fallback="Chart unavailable"><BFSICharts /></ErrorBoundary>
  if (caseKey === 'smartphone')
    return <ErrorBoundary fallback="Chart unavailable"><SalesCharts /></ErrorBoundary>
  return <ErrorBoundary fallback="Chart unavailable"><EconomyCharts /></ErrorBoundary>
}

export function DemoPanel({ caseKey, useCase, model, etlConfig }: DemoPanelProps) {
  const { running, logs, activeStage, activeAgents, records, throughput, startPipeline, stopPipeline, resetPipeline } = usePipeline()

  useEffect(() => {
    resetPipeline()
  }, [caseKey, model, resetPipeline])

  const handleToggle = useCallback(() => {
    if (running) stopPipeline()
    else startPipeline()
  }, [running, startPipeline, stopPipeline])

  const pipelineErrors = running ? Math.floor(Math.random() * 3) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
      {/* Header */}
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: COLORS.text, marginBottom: 4 }}>
            {useCase.label}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 10 }}>
            {useCase.desc}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {useCase.datasets.map(ds => (
              <Badge key={ds} color={COLORS.accent} size="sm">{ds}</Badge>
            ))}
          </div>
        </div>
        <button
          onClick={handleToggle}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 700,
            color: running ? COLORS.accentDanger : COLORS.accent3,
            background: running ? `${COLORS.accentDanger}14` : `${COLORS.accent3}14`,
            border: `1px solid ${running ? COLORS.accentDanger : COLORS.accent3}`,
            borderRadius: 7,
            padding: '9px 18px',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {running ? '◼ Stop Pipeline' : '▶ Run ETL Pipeline'}
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {useCase.kpis.map(kpi => (
          <KPICard key={kpi.l} label={kpi.l} value={kpi.v} delta={kpi.d} />
        ))}
        {running && (
          <>
            <KPICard label="Records Processed" value={records.toLocaleString()} delta="+Live" />
            <KPICard
              label="Pipeline Errors"
              value={String(pipelineErrors)}
              delta={pipelineErrors > 0 ? `${pipelineErrors} flagged` : undefined}
            />
          </>
        )}
      </div>

      {/* ETL Pipeline */}
      <ETLPipeline running={running} activeStage={activeStage} etlConfig={etlConfig} />

      {/* Agents + Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <AgentFrameworkPanel agents={useCase.agents} activeAgents={activeAgents} running={running} />
        <LogTerminal logs={logs} />
      </div>

      {/* Charts */}
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 10 }}>
          Domain Analytics
        </div>
        <ChartSection caseKey={caseKey} />
      </div>

      {/* AI Query */}
      <AIQueryPanel model={model} caseKey={caseKey} />
    </div>
  )
}
