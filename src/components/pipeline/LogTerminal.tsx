import { useEffect, useRef } from 'react'
import { COLORS } from '@lib/theme'

interface LogTerminalProps {
  logs: string[]
}

const TAG_COLORS: Record<string, string> = {
  '[EXTRACT]':   '#00D4FF',
  '[VALIDATE]':  '#F59E0B',
  '[TRANSFORM]': '#8B5CF6',
  '[AGGREGATE]': '#10B981',
  '[LOAD]':      '#3B82F6',
  '[INDEX]':     '#EC4899',
  '[AGENTS]':    '#22D3EE',
  '[A2A]':       '#FB923C',
  '[REPORT]':    '#84CC16',
  '[PIPELINE]':  '#F1F5F9',
}

function parseLog(line: string) {
  const match = line.match(/^(\[\w+\])\s*(.*)$/)
  if (!match) return { tag: '', msg: line, color: COLORS.textDim }
  return { tag: match[1], msg: match[2].trimStart(), color: TAG_COLORS[match[1]] ?? COLORS.textDim }
}

export function LogTerminal({ logs }: LogTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <>
      <style>{`
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .log-line { animation: slide-up-fade 0.2s ease-out; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { animation: blink 1s step-end infinite; }
      `}</style>
      <div
        ref={containerRef}
        style={{
          background: '#060A12',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          height: 190,
          overflowY: 'auto',
          padding: '10px 12px',
          fontFamily: 'monospace',
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        {logs.length === 0 ? (
          <span style={{ color: COLORS.textMuted }}>
            {'> '}<span className="cursor">█</span>
          </span>
        ) : (
          logs.map((line, i) => {
            const { tag, msg, color } = parseLog(line)
            return (
              <div key={i} className="log-line" style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ color: COLORS.textMuted, minWidth: 20, textAlign: 'right', userSelect: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tag && (
                  <span style={{ color, fontWeight: 700, minWidth: 80, flexShrink: 0 }}>{tag}</span>
                )}
                <span style={{ color: COLORS.textDim }}>{msg}</span>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
