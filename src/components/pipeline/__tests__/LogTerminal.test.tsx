import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogTerminal } from '../LogTerminal'

describe('LogTerminal', () => {
  it('shows placeholder cursor when logs is empty', () => {
    const { container } = render(<LogTerminal logs={[]} />)
    expect(container.querySelector('.cursor')).toBeTruthy()
  })

  it('renders each log line', () => {
    const logs = [
      '[EXTRACT]  Fetched 100 rows',
      '[VALIDATE] Schema check passed',
    ]
    render(<LogTerminal logs={logs} />)
    expect(screen.getByText('Fetched 100 rows')).toBeTruthy()
    expect(screen.getByText('Schema check passed')).toBeTruthy()
  })

  it('renders correct line numbers', () => {
    const logs = ['[EXTRACT] line one', '[LOAD] line two']
    render(<LogTerminal logs={logs} />)
    expect(screen.getByText('01')).toBeTruthy()
    expect(screen.getByText('02')).toBeTruthy()
  })

  it('applies log-line animation class to each line', () => {
    const { container } = render(<LogTerminal logs={['[PIPELINE] start']} />)
    const lines = container.querySelectorAll('.log-line')
    expect(lines.length).toBe(1)
  })

  it('colours [EXTRACT] tag cyan', () => {
    const { container } = render(<LogTerminal logs={['[EXTRACT]  test message']} />)
    const tagEl = container.querySelector('span[style*="rgb(0, 212, 255)"]')
    expect(tagEl).toBeTruthy()
  })
})
