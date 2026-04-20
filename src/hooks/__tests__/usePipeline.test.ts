import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePipeline } from '../usePipeline'
import { ETL_LOGS } from '@data/etlLogs'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('usePipeline', () => {
  it('starts with running=false and empty logs', () => {
    const { result } = renderHook(() => usePipeline())
    expect(result.current.running).toBe(false)
    expect(result.current.logs).toHaveLength(0)
  })

  it('startPipeline sets running to true', () => {
    const { result } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    expect(result.current.running).toBe(true)
  })

  it('logs start populating after ticks', () => {
    const { result } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current.logs.length).toBeGreaterThan(0)
  })

  it('stopPipeline sets running to false immediately', () => {
    const { result } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    act(() => { result.current.stopPipeline() })
    expect(result.current.running).toBe(false)
  })

  it('resetPipeline returns all state to initial values', () => {
    const { result } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    act(() => { vi.advanceTimersByTime(500) })
    act(() => { result.current.resetPipeline() })
    expect(result.current.running).toBe(false)
    expect(result.current.logs).toHaveLength(0)
    expect(result.current.records).toBe(0)
    expect(result.current.throughput).toBe(0)
    expect(result.current.activeAgents).toHaveLength(0)
  })

  it('auto-stops after all ETL_LOGS consumed', () => {
    const { result } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    act(() => { vi.advanceTimersByTime(ETL_LOGS.length * 300) })
    expect(result.current.running).toBe(false)
    expect(result.current.logs).toHaveLength(ETL_LOGS.length)
  })

  it('cleans up timer on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { result, unmount } = renderHook(() => usePipeline())
    act(() => { result.current.startPipeline() })
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})
