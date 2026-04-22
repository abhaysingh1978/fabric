import type { AIModel } from '@types/index'
import { getKey } from '@lib/apiKeys'

export interface AICompletionRequest {
  systemPrompt: string
  userMessage: string
  maxTokens?: number
}

export interface AICompletionResponse {
  text: string
  error?: string
}

async function readErrorBody(res: Response): Promise<string> {
  try {
    const body = await res.json() as { error?: { message?: string }; message?: string }
    return body?.error?.message ?? body?.message ?? res.statusText
  } catch {
    return res.statusText
  }
}

function formatError(err: unknown, provider: string): string {
  if (err && typeof err === 'object' && 'status' in err) {
    const status = (err as { status: number; body?: string }).status
    const body = (err as { body?: string }).body ?? ''
    if (status === 401) return `Invalid API key for ${provider}. Check your .env file.`
    if (status === 429) return `Rate limit reached for ${provider}. Please wait and try again.`
    if (status === 404) return `Model not found on ${provider}. ${body}`
    if (body) return `${provider} error ${status}: ${body}`
  }
  if (err instanceof TypeError) {
    return `Cannot reach ${provider} — check your network or CORS settings.`
  }
  return `${provider} request failed: ${err instanceof Error ? err.message : String(err)}`
}

async function callAnthropic(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  // Map internal IDs → current Anthropic API model strings
  const modelMap: Record<string, string> = {
    'claude-opus':   'claude-opus-4-7',
    'claude-sonnet': 'claude-sonnet-4-6',
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': getKey('anthropic'),
        'anthropic-version': '2023-06-01',
        // Required for direct browser-to-API calls (bypasses CORS preflight block)
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: modelMap[model.id] ?? 'claude-sonnet-4-6',
        max_tokens: req.maxTokens ?? 1024,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userMessage }],
      }),
    })
    if (!res.ok) {
      const body = await readErrorBody(res)
      throw Object.assign(new Error(body), { status: res.status, body })
    }
    const data = await res.json() as { content: Array<{ text: string }> }
    return { text: data.content[0].text }
  } catch (err) {
    return { text: '', error: formatError(err, 'Anthropic') }
  }
}

async function callGoogle(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  const isPro = model.id === 'gemini-pro'
  const modelId = isPro ? 'gemini-2.5-pro' : 'gemini-2.5-flash'
  // gemini-2.5-pro is a thinking model; its reasoning budget counts against maxOutputTokens.
  // 1024 is exhausted by the thinking trace alone — use 8192 minimum so the visible reply has room.
  const maxOutputTokens = isPro ? Math.max(req.maxTokens ?? 0, 8192) : (req.maxTokens ?? 1024)
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${getKey('google')}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: req.systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: req.userMessage }] }],
        generationConfig: { maxOutputTokens },
      }),
    })
    if (!res.ok) {
      const body = await readErrorBody(res)
      throw Object.assign(new Error(body), { status: res.status, body })
    }
    const data = await res.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    // Thinking models (gemini-2.5-*) return multiple parts; join all text parts
    const parts = data.candidates?.[0]?.content?.parts ?? []
    const text = parts.flatMap(p => (p.text ? [p.text] : [])).join('')
    if (!text) return { text: '', error: 'Google returned an empty response (possible safety filter).' }
    return { text }
  } catch (err) {
    if (err instanceof TypeError) return { text: '', error: 'Cannot reach Google — network error or invalid response.' }
    return { text: '', error: formatError(err, 'Google') }
  }
}

async function callOpenAI(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getKey('openai')}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: req.maxTokens ?? 1024,
        messages: [
          { role: 'system', content: req.systemPrompt },
          { role: 'user', content: req.userMessage },
        ],
      }),
    })
    if (!res.ok) {
      const body = await readErrorBody(res)
      throw Object.assign(new Error(body), { status: res.status, body })
    }
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return { text: data.choices[0].message.content }
  } catch (err) {
    return { text: '', error: formatError(err, 'OpenAI') }
  }
}

async function callOllama(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  const base = getKey('ollama') || 'http://localhost:11434'
  try {
    await fetch(`${base}/api/version`, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
  } catch {
    return { text: '', error: 'Local model server offline. Run: ollama serve' }
  }
  try {
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: model.id,
        prompt: `${req.systemPrompt}\n\nUser: ${req.userMessage}`,
        stream: false,
      }),
    })
    if (!res.ok) {
      const body = await readErrorBody(res)
      // Ollama 404 = model not downloaded yet
      if (res.status === 404) {
        return { text: '', error: `Model not downloaded. Run: ollama pull ${model.id}` }
      }
      throw Object.assign(new Error(body), { status: res.status, body })
    }
    const data = await res.json() as { response: string }
    return { text: data.response }
  } catch (err) {
    return { text: '', error: formatError(err, 'Ollama') }
  }
}

export async function callAI(model: AIModel, request: AICompletionRequest): Promise<AICompletionResponse> {
  switch (model.provider) {
    case 'Anthropic': return callAnthropic(model, request)
    case 'Google':    return callGoogle(model, request)
    case 'OpenAI':    return callOpenAI(model, request)
    case 'Local':     return callOllama(model, request)
  }
}
