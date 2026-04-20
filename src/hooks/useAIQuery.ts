import { useState, useEffect, useCallback } from 'react'
import type { AIModel } from '@types/index'
import { callAI } from '@lib/ai/providers'
import { getSystemPrompt } from '@lib/ai/prompts'

export function useAIQuery(model: AIModel, caseKey: string) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const clearResponse = useCallback(() => {
    setResponse('')
    setError('')
    setQuery('')
  }, [])

  useEffect(() => {
    clearResponse()
  }, [caseKey, clearResponse])

  const ask = useCallback(async (queryText?: string) => {
    if (loading) return
    const text = queryText ?? query
    if (!text.trim()) return

    setLoading(true)
    setResponse('')
    setError('')

    const result = await callAI(model, {
      systemPrompt: getSystemPrompt(caseKey),
      userMessage: text,
    })

    if (result.error) {
      setError(result.error)
    } else {
      setResponse(result.text)
    }
    setLoading(false)
  }, [loading, query, model, caseKey])

  return { query, setQuery, response, loading, error, ask, clearResponse }
}
