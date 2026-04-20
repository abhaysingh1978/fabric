import { describe, it, expect } from 'vitest'
import { DEMOS } from '../usecases'

describe('DEMOS data', () => {
  it('contains all 3 categories', () => {
    expect(Object.keys(DEMOS)).toEqual(expect.arrayContaining(['BFSI', 'Sales', 'Economy']))
  })

  it('each category has a color and at least 1 sub-case', () => {
    for (const [, cat] of Object.entries(DEMOS)) {
      expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Object.keys(cat.sub).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('each use case has 5 agents, 4+ KPIs, 3+ datasets', () => {
    for (const [, cat] of Object.entries(DEMOS)) {
      for (const [, useCase] of Object.entries(cat.sub)) {
        expect(useCase.agents).toHaveLength(5)
        expect(useCase.kpis.length).toBeGreaterThanOrEqual(4)
        expect(useCase.datasets.length).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('all caseKeys are unique across all use cases', () => {
    const keys: string[] = []
    for (const [, cat] of Object.entries(DEMOS)) {
      for (const [, useCase] of Object.entries(cat.sub)) {
        keys.push(useCase.caseKey)
      }
    }
    const unique = new Set(keys)
    expect(unique.size).toBe(keys.length)
  })
})
