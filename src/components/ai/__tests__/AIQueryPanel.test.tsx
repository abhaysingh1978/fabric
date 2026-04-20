import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AIQueryPanel } from '../AIQueryPanel'
import type { AIModel } from '@types/index'

vi.mock('@hooks/useAIQuery', () => ({
  useAIQuery: vi.fn(),
}))

vi.mock('@data/presets', () => ({
  QUERY_PRESETS: {
    stock: ['Preset question 1', 'Preset question 2', 'Preset question 3'],
  },
}))

import { useAIQuery } from '@hooks/useAIQuery'

const model: AIModel = { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', tag: '4.6', color: '#FF8C61' }

const defaultHook = {
  query: '',
  setQuery: vi.fn(),
  response: '',
  loading: false,
  error: '',
  ask: vi.fn(),
  clearResponse: vi.fn(),
}

beforeEach(() => {
  vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook })
})

describe('AIQueryPanel', () => {
  it('renders 3 preset buttons', () => {
    render(<AIQueryPanel model={model} caseKey="stock" />)
    expect(screen.getByText('Preset question 1')).toBeTruthy()
    expect(screen.getByText('Preset question 2')).toBeTruthy()
    expect(screen.getByText('Preset question 3')).toBeTruthy()
  })

  it('clicking preset calls ask with correct text', () => {
    const ask = vi.fn()
    vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook, ask })
    render(<AIQueryPanel model={model} caseKey="stock" />)
    fireEvent.click(screen.getByText('Preset question 1'))
    expect(ask).toHaveBeenCalledWith('Preset question 1')
  })

  it('pressing Enter in input calls ask', () => {
    const ask = vi.fn()
    vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook, query: 'my question', ask })
    render(<AIQueryPanel model={model} caseKey="stock" />)
    const input = screen.getByPlaceholderText(/ask about/i)
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(ask).toHaveBeenCalled()
  })

  it('shows generating message when loading', () => {
    vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook, loading: true })
    render(<AIQueryPanel model={model} caseKey="stock" />)
    expect(screen.getByText(/Generating insights from Claude Sonnet/i)).toBeTruthy()
  })

  it('shows error with ⚠ prefix', () => {
    vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook, error: 'Rate limit reached' })
    render(<AIQueryPanel model={model} caseKey="stock" />)
    expect(screen.getByText(/⚠.*Rate limit/i)).toBeTruthy()
  })

  it('displays response text when provided', () => {
    vi.mocked(useAIQuery).mockReturnValue({ ...defaultHook, response: 'Here is the analysis.' })
    render(<AIQueryPanel model={model} caseKey="stock" />)
    expect(screen.getByText('Here is the analysis.')).toBeTruthy()
  })
})
