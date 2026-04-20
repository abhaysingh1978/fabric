import { describe, it, expect, vi, beforeEach } from 'vitest'
import { callAI } from '../providers'
import type { AIModel } from '@types/index'

const anthropicModel: AIModel = { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', tag: '4.6', color: '#FF8C61' }
const googleModel: AIModel = { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', tag: 'Pro', color: '#4285F4' }
const openaiModel: AIModel = { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tag: 'Latest', color: '#74AA9C' }
const localModel: AIModel = { id: 'llama3.3:70b', name: 'Llama 3.3', provider: 'Local', tag: '70B', color: '#8B5CF6' }

const baseRequest = { systemPrompt: 'You are a test assistant.', userMessage: 'Hello' }

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('callAI routing', () => {
  it('routes Anthropic provider to correct endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'anthropic response' }] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await callAI(anthropicModel, baseRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result.text).toBe('anthropic response')
    expect(result.error).toBeUndefined()
  })

  it('routes Google provider to correct endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'google response' }] } }] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await callAI(googleModel, baseRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result.text).toBe('google response')
  })

  it('routes OpenAI provider to correct endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'openai response' } }] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await callAI(openaiModel, baseRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result.text).toBe('openai response')
  })

  it('routes Local provider to Ollama endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'ollama response' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await callAI(localModel, baseRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/generate'),
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result.text).toBe('ollama response')
  })
})

describe('callAI Anthropic request shape', () => {
  it('sends correct headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'ok' }] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await callAI(anthropicModel, baseRequest)

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Record<string, string>
    expect(headers).toMatchObject({
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    })
  })

  it('extracts text from content[0].text', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'extracted text' }] }),
    }))
    const result = await callAI(anthropicModel, baseRequest)
    expect(result.text).toBe('extracted text')
  })
})

describe('callAI error handling', () => {
  it('returns error message on 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    }))
    const result = await callAI(anthropicModel, baseRequest)
    expect(result.error).toMatch(/Invalid API key/i)
    expect(result.text).toBe('')
  })

  it('returns error message on 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    }))
    const result = await callAI(anthropicModel, baseRequest)
    expect(result.error).toMatch(/Rate limit/i)
  })

  it('returns graceful error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const result = await callAI(anthropicModel, baseRequest)
    expect(result.error).toBeTruthy()
    expect(result.text).toBe('')
  })
})
