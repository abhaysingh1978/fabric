import { COLORS } from '@lib/theme'

interface Segment {
  value: number
  color: string
}

interface DonutChartProps {
  segments: Segment[]
  size?: number
}

export function DonutChart({ segments, size = 100 }: DonutChartProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4
  const innerR = r * 0.52
  const total = segments.reduce((s, seg) => s + seg.value, 0)

  let cumAngle = -Math.PI / 2
  const paths = segments.map((seg, i) => {
    const angle = (seg.value / total) * Math.PI * 2
    const startAngle = cumAngle
    const endAngle = cumAngle + angle
    cumAngle = endAngle

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = angle > Math.PI ? 1 : 0

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return <path key={i} d={d} fill={seg.color} stroke={COLORS.bgCard} strokeWidth={1.5} />
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {paths}
      <circle cx={cx} cy={cy} r={innerR} fill={COLORS.bgCard} />
    </svg>
  )
}
