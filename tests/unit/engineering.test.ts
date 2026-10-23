import { describe, expect, it } from 'vitest'
import { airTopologies, machineComponents, refrigerantTopology } from '../../src/models/engineering'

describe('stage 2 engineering topology', () => {
  it('keeps the heat-pump refrigerant circuit in the required order', () => {
    expect(refrigerantTopology).toEqual(['compressor', 'condenser', 'capillary', 'evaporator', 'compressor'])
  })

  it('keeps each machine air boundary distinct', () => {
    expect(airTopologies.vented.at(-1)).toBe('outdoor-exhaust')
    expect(airTopologies.condenser[0]).toBe(airTopologies.condenser.at(-1))
    expect(airTopologies['heat-pump']).toEqual(['condenser', 'drum', 'lint-filter', 'evaporator', 'fan', 'condenser'])
  })

  it('includes condensate handling only for recirculating condenser machines', () => {
    expect(machineComponents.vented).not.toContain('water-tray')
    expect(machineComponents.condenser).toContain('water-tray')
    expect(machineComponents['heat-pump']).toContain('drain')
  })
})
