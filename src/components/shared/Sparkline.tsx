interface SparklineProps {
  data: number[]
  color: string
  width?: number
  height?: number
}

export function Sparkline({ data, color, width = 120, height = 40 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 2

  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (width - pad * 2))
  const ys = data.map(v => pad + (1 - (v - min) / range) * (height - pad * 2))

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const areaPath = `${linePath} L${xs[xs.length - 1]},${height - pad} L${xs[0]},${height - pad} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <path d={areaPath} fill={color} fillOpacity={0.1} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
