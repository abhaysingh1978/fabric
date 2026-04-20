import type { CSSProperties } from 'react'

interface BadgeProps {
  children: React.ReactNode
  color: string
  size?: 'sm' | 'md'
}

export function Badge({ children, color, size = 'md' }: BadgeProps) {
  const style: CSSProperties = {
    display: 'inline-block',
    fontFamily: 'monospace',
    fontWeight: 600,
    color,
    background: `${color}38`,
    border: `1px solid ${color}55`,
    borderRadius: 4,
    padding: size === 'sm' ? '1px 6px' : '2px 8px',
    fontSize: size === 'sm' ? 10 : 11,
    letterSpacing: '0.04em',
    lineHeight: 1.6,
  }
  return <span style={style}>{children}</span>
}
