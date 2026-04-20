import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KPICard } from '../KPICard'

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Tickers" value="4,200+" />)
    expect(screen.getByText('Tickers')).toBeTruthy()
    expect(screen.getByText('4,200+')).toBeTruthy()
  })

  it('renders delta when provided', () => {
    render(<KPICard label="Accuracy" value="87.3%" delta="+2.1%" />)
    expect(screen.getByText('+2.1%')).toBeTruthy()
  })

  it('does not render delta element when delta is undefined', () => {
    const { container } = render(<KPICard label="Funds" value="382" />)
    const divs = Array.from(container.querySelectorAll('div'))
    expect(divs).toHaveLength(3)
  })

  it('renders delta "+" in green (#10B981)', () => {
    const { container } = render(<KPICard label="AUM" value="$2.4B" delta="+$140M" />)
    const deltaEl = container.querySelector('div[style*="rgb(16, 185, 129)"]')
    expect(deltaEl).toBeTruthy()
  })

  it('renders delta "Live" in green', () => {
    const { container } = render(<KPICard label="Freshness" value="<4hrs" delta="Live" />)
    const deltaEl = container.querySelector('div[style*="rgb(16, 185, 129)"]')
    expect(deltaEl).toBeTruthy()
  })
})
