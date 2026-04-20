import { memo } from 'react'
import { COLORS } from '@lib/theme'
import { DonutChart } from '@components/shared/DonutChart'

function ChartCard({ title, children, fullWidth }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: '14px 16px',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: COLORS.textMuted, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</div>
      {children}
    </div>
  )
}

const MARKET_SHARE = [
  { label: 'Apple',   value: 18, color: '#94A3B8' },
  { label: 'Samsung', value: 22, color: '#3B82F6' },
  { label: 'Xiaomi',  value: 13, color: '#F59E0B' },
  { label: 'Google',  value: 4,  color: '#10B981' },
  { label: 'Others',  value: 43, color: '#1E2A3A' },
]

const SENTIMENT = [
  { label: 'Apple',        score: 84, color: '#94A3B8' },
  { label: 'Samsung',      score: 76, color: '#3B82F6' },
  { label: 'Google Pixel', score: 88, color: '#10B981' },
]

const QUARTERS = ['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25']
const SALES_DATA = {
  Apple:   [58, 52, 61, 79, 62],
  Samsung: [72, 68, 75, 82, 70],
  Google:  [9,  10, 11, 13, 12],
}
const BRAND_COLORS: Record<string, string> = { Apple: '#94A3B8', Samsung: '#3B82F6', Google: '#10B981' }

export const SalesCharts = memo(function SalesCharts() {
  const svgW = 400; const svgH = 110
  const barW = 16; const brandGap = 2; const groupGap = 8
  const maxVal = 90
  const chartH = 80; const baseline = 90; const leftPad = 10

  const brands = Object.keys(SALES_DATA) as Array<keyof typeof SALES_DATA>
  const groupW = brands.length * (barW + brandGap) - brandGap + groupGap

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <ChartCard title="Market Share">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <DonutChart segments={MARKET_SHARE} size={90} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {MARKET_SHARE.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 9, color: COLORS.textDim }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                {s.label} {s.value}%
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Brand Sentiment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SENTIMENT.map(s => (
            <div key={s.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 10, color: COLORS.textDim, marginBottom: 4 }}>
                <span>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.score}/100</span>
              </div>
              <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${s.score}%`, height: '100%', background: s.color, opacity: 0.85, borderRadius: 3, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Quarterly Sales Trend (Millions)" fullWidth>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: 'block' }}>
          {QUARTERS.map((q, gi) => {
            const gx = leftPad + gi * groupW
            return (
              <g key={q}>
                {brands.map((brand, bi) => {
                  const val = SALES_DATA[brand][gi]
                  const bh = (val / maxVal) * chartH
                  const bx = gx + bi * (barW + brandGap)
                  const by = baseline - bh
                  return (
                    <rect key={brand} x={bx} y={by} width={barW} height={bh}
                      fill={BRAND_COLORS[brand]} fillOpacity={0.8} rx={2} />
                  )
                })}
                <text x={gx + (brands.length * (barW + brandGap)) / 2 - 4} y={baseline + 10}
                  fill={COLORS.textMuted} fontSize="7" textAnchor="middle" fontFamily="monospace">{q}</text>
              </g>
            )
          })}
          {brands.map((brand, i) => (
            <g key={brand}>
              <rect x={leftPad + i * 60} y={svgH - 12} width={8} height={8} fill={BRAND_COLORS[brand]} fillOpacity={0.85} rx={1} />
              <text x={leftPad + i * 60 + 12} y={svgH - 5} fill={COLORS.textMuted} fontSize="7" fontFamily="monospace">{brand}</text>
            </g>
          ))}
        </svg>
      </ChartCard>
    </div>
  )
})
