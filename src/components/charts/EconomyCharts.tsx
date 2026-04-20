import { memo } from 'react'
import { COLORS } from '@lib/theme'
import { useWorldBankData } from '@hooks/useWorldBankData'
import type { WBDataPoint } from '@lib/data/worldBank'

// Country colour palette (ordered by GDP rank)
const COUNTRY_COLORS: Record<string, string> = {
  USA: '#3B82F6', China: '#EF4444', Germany: '#F59E0B', Japan: '#10B981',
  India: '#EC4899', UK: '#6366F1', France: '#14B8A6', Brazil: '#84CC16',
  Italy: '#F97316', Canada: '#A855F7',
}
function colorFor(label: string) { return COUNTRY_COLORS[label] ?? '#64748B' }

function ChartCard({ title, children, fullWidth }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8,
      padding: '14px 16px', gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
      {children}
    </div>
  )
}

function LoadingState({ rows = 10 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ height: 14, background: COLORS.border, borderRadius: 3, opacity: 0.6, width: `${60 + Math.sin(i) * 30}%` }} />
      ))}
    </div>
  )
}

function GDPChart({ data }: { data: WBDataPoint[] }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {data.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textDim, minWidth: 56 }}>{c.label}</div>
          <div style={{ flex: 1, height: 14, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${(c.value / (max * 1.05)) * 100}%`, height: '100%',
              background: colorFor(c.label), opacity: 0.8, borderRadius: 3,
              transition: 'width 1.2s ease',
            }} />
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: colorFor(c.label), minWidth: 44, textAlign: 'right', fontWeight: 700 }}>
            ${c.value}T
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniBarChart({ data, color, maxVal }: { data: WBDataPoint[]; color: string; maxVal: number }) {
  const svgW = 280; const svgH = 90
  const barW = (svgW - 20) / data.length - 3
  const chartH = 65; const baseline = 72

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const bh = Math.max(2, (Math.abs(d.value) / maxVal) * chartH)
        const bx = 10 + i * (barW + 3)
        const by = baseline - bh
        return (
          <g key={d.label}>
            <rect x={bx} y={by} width={barW} height={bh} fill={color} fillOpacity={0.8} rx={2} />
            <text x={bx + barW / 2} y={baseline + 9} fill={COLORS.textMuted} fontSize="6.5" textAnchor="middle" fontFamily="monospace">
              {d.countryCode === 'GB' ? 'UK' : d.countryCode}
            </text>
            <text x={bx + barW / 2} y={by - 2} fill={color} fontSize="6" textAnchor="middle" fontFamily="monospace">
              {d.value > 0 ? d.value : '—'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function DataTimestamp() {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 }}>
      Source: World Bank · Most recent available year
    </div>
  )
}

// Static fallback data (used when API is unavailable)
const STATIC_GDP = [
  { countryCode: 'US', label: 'USA',     value: 27.4 },
  { countryCode: 'CN', label: 'China',   value: 18.6 },
  { countryCode: 'DE', label: 'Germany', value: 4.5  },
  { countryCode: 'JP', label: 'Japan',   value: 4.1  },
  { countryCode: 'IN', label: 'India',   value: 3.7  },
  { countryCode: 'GB', label: 'UK',      value: 3.1  },
  { countryCode: 'FR', label: 'France',  value: 2.9  },
  { countryCode: 'BR', label: 'Brazil',  value: 2.1  },
  { countryCode: 'IT', label: 'Italy',   value: 2.1  },
  { countryCode: 'CA', label: 'Canada',  value: 2.1  },
]
const STATIC_INFLATION = [
  { countryCode:'US',label:'USA',value:3.4},{countryCode:'CN',label:'China',value:0.2},
  { countryCode:'DE',label:'Germany',value:2.2},{countryCode:'JP',label:'Japan',value:2.8},
  { countryCode:'IN',label:'India',value:5.4},{countryCode:'GB',label:'UK',value:3.2},
  { countryCode:'FR',label:'France',value:2.4},{countryCode:'BR',label:'Brazil',value:4.8},
  { countryCode:'IT',label:'Italy',value:1.8},{countryCode:'CA',label:'Canada',value:2.9},
]
const STATIC_GROWTH = [
  { countryCode:'IN',label:'India',value:6.8},{countryCode:'CN',label:'China',value:4.6},
  { countryCode:'BR',label:'Brazil',value:2.3},{countryCode:'US',label:'USA',value:2.1},
  { countryCode:'CA',label:'Canada',value:1.8},{countryCode:'GB',label:'UK',value:1.3},
  { countryCode:'FR',label:'France',value:1.1},{countryCode:'JP',label:'Japan',value:1.1},
  { countryCode:'IT',label:'Italy',value:0.7},{countryCode:'DE',label:'Germany',value:0.2},
]

export const EconomyCharts = memo(function EconomyCharts() {
  const { data, status, error } = useWorldBankData()

  const gdpData = data?.gdp ?? (status === 'error' ? STATIC_GDP : null)
  const inflationData = data?.inflation ?? (status === 'error' ? STATIC_INFLATION : null)
  const growthData = data?.growth ?? (status === 'error' ? STATIC_GROWTH : null)

  const maxInflation = inflationData ? Math.ceil(Math.max(...inflationData.map(d => Math.abs(d.value))) * 1.2) : 7
  const maxGrowth = growthData ? Math.ceil(Math.max(...growthData.map(d => d.value)) * 1.2) : 8

  const isLive = status === 'ready'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <ChartCard title={`GDP ${isLive ? '(Live · World Bank)' : 'USD Trillion'}`} fullWidth>
        {gdpData ? <GDPChart data={gdpData} /> : <LoadingState rows={10} />}
        {isLive && <DataTimestamp />}
        {status === 'error' && <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.accentWarn, marginTop: 4 }}>⚠ {error} — showing cached data</div>}
      </ChartCard>

      <ChartCard title={`Inflation Rate ${isLive ? '(Live · World Bank)' : '2024 (%)'}`}>
        {inflationData
          ? <MiniBarChart data={inflationData} color={COLORS.accentWarn} maxVal={maxInflation} />
          : <LoadingState rows={5} />}
      </ChartCard>

      <ChartCard title={`GDP Growth Forecast ${isLive ? '(Live · World Bank)' : '2025 (%)'}`}>
        {growthData
          ? <MiniBarChart data={growthData} color={COLORS.accent3} maxVal={maxGrowth} />
          : <LoadingState rows={5} />}
      </ChartCard>
    </div>
  )
})
