import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { processComponentMap, useTeachingStore } from '../../src/state/teachingStore'
import type { ThermodynamicData } from '../../src/thermo/types'

const data = JSON.parse(readFileSync(resolve('public/data/stage3-thermodynamics.json'), 'utf8')) as ThermodynamicData

describe('generated thermodynamic data', () => {
  it('carries traceable versions, SI units and passing checks', () => {
    expect(data.library).toMatchObject({ name: 'CoolProp', version: '7.2.0', license: 'MIT' })
    expect(data.algorithmVersion).toBe('1.0.0')
    expect(data.units.pressure).toContain('MPa')
    expect(Object.values(data.refrigerant.checks).every((value) => value === true || value === 0)).toBe(true)
    expect(Object.values(data.humidAir.checks).every((value) => value === true || value === 0)).toBe(true)
  })

  it('uses the same state data for cycle processes and energy balance', () => {
    const states = Object.fromEntries(data.refrigerant.states.map((point) => [point.id, point]))
    const e = data.refrigerant.energyPerKg
    expect(states['4'].quality).toBeGreaterThan(0)
    expect(states['4'].quality).toBeLessThan(1)
    expect(states['3'].enthalpyKJkg).toBeCloseTo(states['4'].enthalpyKJkg, 5)
    expect(e.condenserHeatKJkg).toBeCloseTo(e.evaporatorHeatKJkg + e.compressorWorkKJkg, 3)
    for (const process of data.refrigerant.processes) expect(processComponentMap[process.id]).toBe(process.component)
  })

  it('keeps humid-air heating, moisture pickup and condensation physically consistent', () => {
    const states = Object.fromEntries(data.humidAir.states.map((point) => [point.id, point]))
    expect(states['A'].humidityRatioKgKgDryAir).toBeCloseTo(states['B'].humidityRatioKgKgDryAir, 6)
    expect(states['C'].humidityRatioKgKgDryAir).toBeGreaterThan(states['B'].humidityRatioKgKgDryAir)
    expect(data.humidAir.assumptions.evaporatorSurfaceTemperatureC).toBeLessThan(states['C'].dewPointC)
  })
})

describe('unified chart / 3D / timeline selection', () => {
  beforeEach(() => useTeachingStore.getState().reset())

  it('maps a P-h process to its 3D component, circuit and teaching step', () => {
    useTeachingStore.getState().selectProcess('3-4', 'capillary')
    expect(useTeachingStore.getState()).toMatchObject({ selectedProcess: '3-4', selectedComponent: 'capillary', circuit: 'refrigerant', step: 3 })
  })

  it('maps a 3D air-process selection back to the chart and timeline', () => {
    useTeachingStore.getState().selectComponent('evaporator', 'dehumidifying')
    expect(useTeachingStore.getState()).toMatchObject({ selectedProcess: 'dehumidifying', selectedComponent: 'evaporator', circuit: 'both', step: 7 })
  })
})
