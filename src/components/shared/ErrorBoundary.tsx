import { Component, type ReactNode, type ErrorInfo } from 'react'
import { COLORS } from '@lib/theme'

interface Props {
  children: ReactNode
  fallback?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Fabric ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      const msg = this.props.fallback ?? 'Something went wrong'
      return (
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.accentDanger}44`,
          borderRadius: 8,
          padding: '16px 20px',
          fontFamily: 'monospace',
        }}>
          <div style={{ color: COLORS.accentDanger, fontWeight: 700, marginBottom: 8 }}>⚠ {msg}</div>
          <pre style={{ color: COLORS.textMuted, fontSize: 10, whiteSpace: 'pre-wrap', marginBottom: 12 }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { window.location.reload() }}
            style={{
              fontFamily: 'monospace', fontSize: 11, color: COLORS.text,
              background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`,
              borderRadius: 5, padding: '5px 12px', cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
