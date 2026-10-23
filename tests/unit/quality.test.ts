import { describe, expect, it } from 'vitest'
import { resolveQuality } from '../../src/scene/quality'

describe('adaptive quality policy', () => {
  it('honors explicit user choices', () => {
    expect(resolveQuality('low', { memoryGB: 32, logicalCores: 24 })).toBe('low')
    expect(resolveQuality('high', { memoryGB: 2, logicalCores: 2 })).toBe('high')
  })

  it('falls back for constrained or reduced-motion devices', () => {
    expect(resolveQuality('auto', { memoryGB: 4, logicalCores: 8 })).toBe('low')
    expect(resolveQuality('auto', { memoryGB: 16, logicalCores: 16, reducedMotion: true })).toBe('low')
  })

  it('selects high only for capable, moderate-DPR devices', () => {
    expect(resolveQuality('auto', { memoryGB: 16, logicalCores: 12, devicePixelRatio: 1.5 })).toBe('high')
    expect(resolveQuality('auto', { memoryGB: 8, logicalCores: 8, devicePixelRatio: 3 })).toBe('balanced')
  })
})
