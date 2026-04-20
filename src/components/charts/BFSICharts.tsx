import { memo, useMemo } from 'react'
import { COLORS } from '@lib/theme'
import { Sparkline } from '@components/shared/Sparkline'
import { DonutChart } from '@components/shared/DonutChart'
import { useStockData } from '@hooks/useStockData'

function ChartCard({ title, children, badge }: { title: string; children: React.ReactNode; badge?: string }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
        {badge && <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.accent3, background: `${COLORS.accent3}22`, border: `1px solid ${COLORS.accent3}44`, borderRadius: 3, padding: '1px 6px' }}>{badge}</div>}
      </div>
      {children}
    </div>
  )
}

function Skeleton() {
  return <div style={{ height: 60, background: COLORS.border, borderRadius: 4, opacity: 0.5 }} />
}

const SECTOR_SEGMENTS_STATIC = [
  { value: 35, color: '#00D4FF' }, { value: 20, color: '#7C3AED' },
  { value: 18, color: '#10B981' }, { value: 15, color: '#F59E0B' },
  { value: 12, color: '#EC4899' },
]
const SECTOR_LABELS_STATIC = ['Tech 35%', 'Finance 20%', 'Health 18%', 'Energy 15%', 'Other 12%']

export const BFSICharts = memo(function BFSICharts() {
  const { bars, status, error, hasKey } = useStockData()

  // Stable fallback data (useMemo with no deps = computed once on mount)
  const fallbackPrice = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => 150 + Math.sin(i * 0.4) * 20 + (Math.abs(Math.sin(i * 7.3)) * 10)),
  [])
  const fallbackVolume = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => 1_400_000 + Math.abs(Math.sin(i * 3.1)) * 300_000),
  [])

  const priceData = bars ? bars.map(b => b.close) : (status === 'error' ? fallbackPrice : null)
  const volumeData = bars ? bars.map(b => b.volume) : (status === 'error' ? fallbackVolume : null)

  const isLive = status === 'ready' && !!bars
  const symbol = (import.meta.env.VITE_ALPHA_VANTAGE_API_KEY ?? 'demo') === 'demo' ? 'IBM' : 'SPY'

  // Price delta calculation from real data
  const priceDelta = useMemo(() => {
    if (!bars || bars.length < 2) return '+8.4%'
    const first = bars[0].close; const last = bars[bars.length - 1].close
    const pct = ((last - first) / first) * 100
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
  }, [bars])

  // Volume spike detection
  const volumeSpike = useMemo(() => {
    if (!bars || bars.length < 5) return false
    const recent = bars.at(-1)!.volume
    const avg = bars.slice(-10, -1).reduce((s, b) => s + b.volume, 0) / 9
    return recent > avg * 1.3
  }, [bars])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <ChartCard title={isLive ? `${symbol} Price (30-day · Live)` : 'Price History (30-day)'} badge={isLive ? 'Alpha Vantage' : undefined}>
        {priceData
          ? <>
              <Sparkline data={priceData} color={COLORS.accent} width={220} height={60} />
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: parseFloat(priceDelta) >= 0 ? COLORS.accent3 : COLORS.accentDanger, marginTop: 6, fontWeight: 700 }}>
                {priceDelta} {isLive ? '30d' : 'MTD'}
              </div>
            </>
          : !hasKey
            ? <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, padding: '8px 0' }}>Set VITE_ALPHA_VANTAGE_API_KEY for live data</div>
            : <Skeleton />
        }
        {status === 'error' && <div style={{ fontFamily: 'monospace', fontSize: 9, color: COLORS.accentWarn, marginTop: 4 }}>⚠ {error}</div>}
      </ChartCard>

      <ChartCard title={isLive ? `${symbol} Volume (30-day · Live)` : 'Volume Trend'} badge={isLive ? 'Alpha Vantage' : undefined}>
        {volumeData
          ? <>
              <Sparkline data={volumeData} color="#8B5CF6" width={220} height={60} />
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8B5CF6', marginTop: 6 }}>
                {volumeSpike ? '↑ Volume spike detected' : '→ Volume within normal range'}
              </div>
            </>
          : !hasKey ? null : <Skeleton />
        }
      </ChartCard>

      <ChartCard title="Sector Allocation">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DonutChart segments={SECTOR_SEGMENTS_STATIC} size={90} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SECTOR_LABELS_STATIC.map((l, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, color: COLORS.textDim }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: SECTOR_SEGMENTS_STATIC[i].color, flexShrink: 0 }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Risk / Return">
        <svg viewBox="0 0 220 100" width="100%" style={{ display: 'block' }}>
          <line x1="20" y1="80" x2="210" y2="80" stroke={COLORS.border} strokeWidth={1} />
          <line x1="20" y1="10" x2="20"  y2="80" stroke={COLORS.border} strokeWidth={1} />
          <text x="105" y="95" fill={COLORS.textMuted} fontSize="8" textAnchor="middle" fontFamily="monospace">Risk →</text>
          <text x="8" y="45" fill={COLORS.textMuted} fontSize="8" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,8,45)">Return</text>
          {[
            { label: 'Portfolio',    cx: 80,  cy: 35, r: 7,  color: COLORS.accent },
            { label: 'Benchmark',    cx: 110, cy: 50, r: 10, color: COLORS.accent3 },
            { label: 'Aggressive',   cx: 160, cy: 25, r: 14, color: COLORS.accentWarn },
            { label: 'Conservative', cx: 50,  cy: 60, r: 6,  color: '#8B5CF6' },
          ].map(p => (
            <g key={p.label}>
              <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} fillOpacity={0.5} stroke={p.color} strokeWidth={1.5} />
              <text x={p.cx} y={p.cy - p.r - 3} fill={p.color} fontSize="7" textAnchor="middle" fontFamily="monospace">{p.label}</text>
            </g>
          ))}
        </svg>
      </ChartCard>
    </div>
  )
})
