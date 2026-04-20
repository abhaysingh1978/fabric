import { useState, useRef, useEffect, useCallback } from 'react'
import { ETL_LOGS } from '@data/etlLogs'

interface PipelineStageState {
  running: boolean
  activeStage: number
  activeAgents: number[]
  records: number
  throughput: number
}

const INITIAL: PipelineStageState = {
  running: false,
  activeStage: 0,
  activeAgents: [],
  records: 0,
  throughput: 0,
}

export function usePipeline() {
  const [state, setState] = useState<PipelineStageState>(INITIAL)
  // logs kept as ref to allow DOM mutation without triggering re-renders on every tick
  const logsRef = useRef<string[]>([])
  const [logsVersion, setLogsVersion] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logIdxRef = useRef(0)
  const logContainerRef = useRef<HTMLDivElement | null>(null)
  void logContainerRef // reserved for future DOM optimisation

  const stopPipeline = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setState(s => ({ ...s, running: false }))
  }, [])

  const tick = useCallback(() => {
    const idx = logIdxRef.current
    const total = ETL_LOGS.length

    if (idx >= total) {
      setState(s => ({ ...s, running: false }))
      return
    }

    const nextLog = ETL_LOGS[idx]
    logsRef.current = [...logsRef.current, nextLog]

    // append via DOM mutation if container is mounted, else bump version for React re-render
    if (logContainerRef.current) {
      setLogsVersion(v => v + 1)
    }

    const activeStage = Math.min(5, Math.floor((idx / total) * 6))
    const activeAgents = idx > 8
      ? Array.from({ length: Math.min(5, Math.floor((idx - 8) / 2) + 1) }, (_, i) => i)
      : []
    const records = idx * 12400 + Math.floor(Math.random() * 3000)
    const throughput = 800 + Math.floor(Math.random() * 400)

    setState(s => ({ ...s, activeStage, activeAgents, records, throughput }))

    logIdxRef.current = idx + 1

    const delay = 160 + Math.random() * 100
    timerRef.current = setTimeout(tick, delay)
  }, [])

  const startPipeline = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    logIdxRef.current = 0
    logsRef.current = []
    setLogsVersion(0)
    setState({ ...INITIAL, running: true })
    timerRef.current = setTimeout(tick, 160)
  }, [tick])

  const resetPipeline = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    logIdxRef.current = 0
    logsRef.current = []
    setLogsVersion(0)
    setState(INITIAL)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    running: state.running,
    logs: logsRef.current,
    activeStage: state.activeStage,
    activeAgents: state.activeAgents,
    records: state.records,
    throughput: state.throughput,
    startPipeline,
    stopPipeline,
    resetPipeline,
  }
}
