import type { AIModel } from '@types/index'

export const AI_MODELS: { local: AIModel[]; cloud: AIModel[] } = {
  local: [
    { id: 'deepseek-r1:7b',    name: 'DeepSeek R1',   provider: 'Local', tag: '7B',   color: '#06B6D4' },
    { id: 'llama3.3:70b',      name: 'Llama 3.3',     provider: 'Local', tag: '70B',  color: '#8B5CF6' },
    { id: 'gemma3:27b',        name: 'Gemma 3',       provider: 'Local', tag: '27B',  color: '#10B981' },
    { id: 'mistral-nemo:12b',  name: 'Mistral NeMo',  provider: 'Local', tag: '12B',  color: '#F59E0B' },
    { id: 'phi4:14b',          name: 'Phi-4',         provider: 'Local', tag: '14B',  color: '#EC4899' },
  ],
  cloud: [
    { id: 'claude-opus',    name: 'Claude Opus',    provider: 'Anthropic', tag: '4.6',    color: '#FF6B35' },
    { id: 'claude-sonnet',  name: 'Claude Sonnet',  provider: 'Anthropic', tag: '4.6',    color: '#FF8C61' },
    { id: 'gemini-pro',     name: 'Gemini 2.0 Pro', provider: 'Google',    tag: 'Pro',    color: '#4285F4' },
    { id: 'gemini-flash',   name: 'Gemini Flash',   provider: 'Google',    tag: '2.0',    color: '#34A853' },
    { id: 'gpt-4o',         name: 'GPT-4o',         provider: 'OpenAI',    tag: 'Latest', color: '#74AA9C' },
  ],
}

export const DEFAULT_MODEL: AIModel = AI_MODELS.cloud[1] // Claude Sonnet
