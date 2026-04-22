import { useEffect, type KeyboardEvent } from 'react'
import { COLORS } from '@lib/theme'
import { useAIQuery } from '@hooks/useAIQuery'
import { QUERY_PRESETS } from '@data/presets'
import { getKey } from '@lib/apiKeys'
import type { AIModel } from '@types/index'

interface AIQueryPanelProps {
  model: AIModel
  caseKey: string
}

export function AIQueryPanel({ model, caseKey }: AIQueryPanelProps) {
  const { query, setQuery, response, loading, error, ask, clearResponse } = useAIQuery(model, caseKey)

  useEffect(() => {
    clearResponse()
  }, [caseKey, clearResponse])

  const presets = QUERY_PRESETS[caseKey] ?? []
  const hasApiKey = !!getKey('anthropic') || !!getKey('google') || !!getKey('openai')

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') ask()
  }

  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: COLORS.accent,
            boxShadow: `0 0 6px ${COLORS.accent}`,
          }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textDim, fontWeight: 700 }}>
            AI Query Interface
          </span>
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: model.color,
          background: `${model.color}22`,
          border: `1px solid ${model.color}55`,
          borderRadius: 4,
          padding: '2px 8px',
          fontWeight: 700,
        }}>
          {model.name} · {model.tag}
        </div>
      </div>

      {!hasApiKey && !response && (
        <div style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: COLORS.accentWarn,
          background: `${COLORS.accentWarn}14`,
          border: `1px solid ${COLORS.accentWarn}44`,
          borderRadius: 6,
          padding: '8px 12px',
        }}>
          Configure API keys in .env to enable AI queries. See .env.example for setup.
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {presets.map(p => (
          <button
            key={p}
            onClick={() => ask(p)}
            disabled={loading}
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: COLORS.textDim,
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 5,
              padding: '4px 10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.borderColor = COLORS.accent
                ;(e.target as HTMLButtonElement).style.color = COLORS.text
              }
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.borderColor = COLORS.border
              ;(e.target as HTMLButtonElement).style.color = COLORS.textDim
            }}
          >
            {p.length > 60 ? p.slice(0, 57) + '…' : p}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${caseKey} data…`}
          style={{
            flex: 1,
            fontFamily: 'monospace',
            fontSize: 11,
            color: COLORS.text,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: '8px 12px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => ask()}
          disabled={loading || !query.trim()}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: loading ? COLORS.textMuted : COLORS.accent,
            background: COLORS.bg,
            border: `1px solid ${loading ? COLORS.border : COLORS.accent}`,
            borderRadius: 6,
            padding: '8px 14px',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !query.trim() ? 0.5 : 1,
            fontWeight: 700,
            transition: 'opacity 0.2s',
          }}
        >
          ↗ Ask
        </button>
      </div>

      {(loading || response || error) && (
        <div style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          padding: '10px 14px',
          maxHeight: 180,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 11,
          lineHeight: 1.7,
        }}>
          {loading && (
            <span style={{ color: COLORS.accent }}>◌ Generating insights from {model.name}…</span>
          )}
          {!loading && error && (
            <span style={{ color: COLORS.accentDanger }}>⚠ {error}</span>
          )}
          {!loading && response && (
            <span style={{ color: COLORS.textDim }}>{response}</span>
          )}
        </div>
      )}
    </div>
  )
}
