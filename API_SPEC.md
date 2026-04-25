# API Integration Specification

**Project:** Aethon — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Date:** April 2026

---

## 1. AI Provider APIs

### 1.1 Anthropic (Claude)

**Endpoint:** `POST https://api.anthropic.com/v1/messages`

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
Content-Type: application/json
x-api-key: ${ANTHROPIC_API_KEY}
anthropic-version: 2023-06-01

{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "system": "<domain_system_prompt>",
  "messages": [
    { "role": "user", "content": "<user_query>" }
  ]
}
```

**Response:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "AI response text here..." }
  ],
  "model": "claude-sonnet-4-20250514",
  "usage": { "input_tokens": 89, "output_tokens": 312 }
}
```

**Error Codes:**
| Code | Meaning | Aethon Response |
|---|---|---|
| 401 | Invalid API key | Show key error, link to Config |
| 429 | Rate limited | Show rate limit, suggest model switch |
| 529 | Overloaded | Retry with exponential backoff |

---

### 1.2 Google (Gemini)

**Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

```http
POST /v1beta/models/gemini-2.0-pro:generateContent?key=${GOOGLE_API_KEY} HTTP/1.1
Host: generativelanguage.googleapis.com
Content-Type: application/json

{
  "system_instruction": {
    "parts": [{ "text": "<domain_system_prompt>" }]
  },
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "<user_query>" }]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7
  }
}
```

**Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "AI response text here..." }],
      "role": "model"
    }
  }],
  "usageMetadata": {
    "promptTokenCount": 89,
    "candidatesTokenCount": 312
  }
}
```

---

### 1.3 OpenAI (GPT-4o)

**Endpoint:** `POST https://api.openai.com/v1/chat/completions`

```http
POST /v1/chat/completions HTTP/1.1
Host: api.openai.com
Content-Type: application/json
Authorization: Bearer ${OPENAI_API_KEY}

{
  "model": "gpt-4o",
  "max_tokens": 1000,
  "messages": [
    { "role": "system", "content": "<domain_system_prompt>" },
    { "role": "user", "content": "<user_query>" }
  ]
}
```

**Response:**
```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "AI response text here..."
    },
    "finish_reason": "stop"
  }],
  "usage": { "prompt_tokens": 89, "completion_tokens": 312 }
}
```

---

### 1.4 Ollama (Local Models)

**Endpoint:** `POST http://localhost:11434/api/generate`

```http
POST /api/generate HTTP/1.1
Host: localhost:11434
Content-Type: application/json

{
  "model": "deepseek-r1:7b",
  "prompt": "<system_prompt>\n\nUser: <user_query>\nAssistant:",
  "stream": false,
  "options": {
    "num_predict": 1000,
    "temperature": 0.7
  }
}
```

**Response:**
```json
{
  "model": "deepseek-r1:7b",
  "response": "AI response text here...",
  "done": true,
  "total_duration": 4823912000,
  "eval_count": 312
}
```

**Ollama Model Pull Commands:**
```bash
ollama pull deepseek-r1:7b
ollama pull llama3.3:70b
ollama pull gemma3:27b
ollama pull mistral-nemo:12b
ollama pull phi4:14b
```

---

## 2. AI Provider Abstraction (TypeScript)

```typescript
// src/lib/ai/providers.ts

export interface AICompletionRequest {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

export interface AICompletionResponse {
  text: string;
  error?: string;
}

export async function callAI(
  model: AIModel,
  request: AICompletionRequest
): Promise<AICompletionResponse> {
  try {
    switch (model.provider) {
      case "Anthropic":
        return await callAnthropic(model.id, request);
      case "Google":
        return await callGoogle(model.id, request);
      case "OpenAI":
        return await callOpenAI(model.id, request);
      case "Local":
        return await callOllama(model.id, request);
      default:
        throw new Error(`Unknown provider: ${model.provider}`);
    }
  } catch (err) {
    return {
      text: "",
      error: formatError(err, model.provider),
    };
  }
}

async function callAnthropic(modelId: string, req: AICompletionRequest) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: req.maxTokens ?? 1000,
      system: req.systemPrompt,
      messages: [{ role: "user", content: req.userMessage }],
    }),
  });
  
  if (!res.ok) throw new APIError(res.status, await res.text());
  const data = await res.json();
  return { text: data.content[0].text };
}

// ... similar implementations for Google, OpenAI, Ollama
```

---

## 3. Environment Variables

```bash
# .env.example — copy to .env and fill in your keys

# Anthropic (Claude)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Google (Gemini)
VITE_GOOGLE_API_KEY=AIza...

# OpenAI (GPT-4o)
VITE_OPENAI_API_KEY=sk-...

# Local Ollama (default port, no key needed)
VITE_OLLAMA_BASE_URL=http://localhost:11434

# App config
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

---

## 4. Rate Limits & Quotas Reference

| Provider | Requests/min | Tokens/min | Notes |
|---|---|---|---|
| Anthropic Claude Sonnet | 50 (Tier 1) | 40,000 | Increases with usage tier |
| Anthropic Claude Opus | 10 (Tier 1) | 10,000 | Higher cost model |
| Google Gemini 2.0 Pro | 360 | 2,000,000 | Generous limits |
| Google Gemini Flash | 1,000 | 4,000,000 | Very high limits |
| OpenAI GPT-4o | 500 | 300,000 | Tier-dependent |
| Ollama (local) | Unlimited | — | Hardware bound |

---

*Document End — API Spec v1.0.0*
