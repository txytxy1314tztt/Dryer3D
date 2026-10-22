import { describe, expect, it } from 'vitest'
import { getMachine, machineCatalog } from '../../src/models/catalog'
import { processComponentMap } from '../../src/state/teachingStore'

describe('stage 1 domain skeleton', () => {
  it('defines the three requested dryer types', () => {
    expect(machineCatalog.map((item) => item.id)).toEqual(['vented', 'condenser', 'heat-pump'])
  })

  it('keeps process-to-component linkage deterministic', () => {
    expect(processComponentMap['1-2']).toBe('compressor')
    expect(processComponentMap['2-3']).toBe('condenser')
    expect(processComponentMap['3-4']).toBe('capillary')
    expect(processComponentMap['4-1']).toBe('evaporator')
  })

  it('does not claim a real product geometry', () => {
    expect(getMachine('heat-pump').shortDescription).toContain('闭式空气循环')
  })
})
