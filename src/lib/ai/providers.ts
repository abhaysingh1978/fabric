import type { AIModel } from '@types/index'

export interface AICompletionRequest {
  systemPrompt: string
  userMessage: string
  maxTokens?: number
}

export interface AICompletionResponse {
  text: string
  error?: string
}

function formatError(err: unknown, provider: string): string {
  if (err instanceof Response || (err && typeof err === 'object' && 'status' in err)) {
    const status = (err as { status: number }).status
    if (status === 401) return `Invalid API key for ${provider}. Check your .env configuration.`
    if (status === 429) return `Rate limit reached for ${provider}. Please wait a moment and try again.`
  }
  if (err instanceof TypeError && err.message.includes('fetch')) {
    return `Network error reaching ${provider}. Check your internet connection.`
  }
  return `${provider} request failed: ${err instanceof Error ? err.message : String(err)}`
}

async function callAnthropic(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  const modelMap: Record<string, string> = {
    'claude-opus':   'claude-opus-4-20250514',
    'claude-sonnet': 'claude-sonnet-4-20250514',
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: modelMap[model.id] ?? 'claude-sonnet-4-20250514',
        max_tokens: req.maxTokens ?? 1024,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userMessage }],
      }),
    })
    if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status })
    const data = await res.json() as { content: Array<{ text: string }> }
    return { text: data.content[0].text }
  } catch (err) {
    return { text: '', error: formatError(err, 'Anthropic') }
  }
}

async function callGoogle(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  const modelId = model.id === 'gemini-pro' ? 'gemini-2.0-pro' : 'gemini-2.0-flash'
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: req.systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: req.userMessage }] }],
        generationConfig: { maxOutputTokens: req.maxTokens ?? 1024 },
      }),
    })
    if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status })
    const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> }
    return { text: data.candidates[0].content.parts[0].text }
  } catch (err) {
    return { text: '', error: formatError(err, 'Google') }
  }
}

async function callOpenAI(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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
    if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status })
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return { text: data.choices[0].message.content }
  } catch (err) {
    return { text: '', error: formatError(err, 'OpenAI') }
  }
}

async function callOllama(model: AIModel, req: AICompletionRequest): Promise<AICompletionResponse> {
  const base = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'
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
    if (!res.ok) throw Object.assign(new Error(res.statusText), { status: res.status })
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
