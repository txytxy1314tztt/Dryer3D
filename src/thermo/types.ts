export type RefrigerantState = {
  id: string
  pressureMPa: number
  temperatureC: number
  enthalpyKJkg: number
  entropyKJkgK: number
  quality: number | null
  phase: string
}

export type HumidAirState = {
  id: string
  dryBulbC: number
  relativeHumidity: number
  humidityRatioKgKgDryAir: number
  enthalpyKJkgDryAir: number
  dewPointC: number
}

type ChartPoint = { dryBulbC: number; humidityRatioGkg: number }

export type ThermodynamicData = {
  schemaVersion: string
  algorithmVersion: string
  generatedAtUtc: string
  library: { name: string; version: string; gitRevision: string; license: string }
  units: Record<string, string>
  scope: string
  sources: string[]
  refrigerant: {
    fluid: string
    assumptions: Record<string, number | boolean>
    states: RefrigerantState[]
    processes: { id: string; label: string; component: string; from: string; to: string }[]
    energyPerKg: {
      compressorWorkKJkg: number
      evaporatorHeatKJkg: number
      condenserHeatKJkg: number
      heatingCOP: number
      statement: string
    }
    saturationDome: {
      liquid: { temperatureC: number; pressureMPa: number; enthalpyKJkg: number }[]
      vapor: { temperatureC: number; pressureMPa: number; enthalpyKJkg: number }[]
    }
    criticalPoint: { temperatureC: number; pressureMPa: number }
    checks: Record<string, boolean | number>
  }
  humidAir: {
    assumptions: Record<string, number | boolean | string>
    states: HumidAirState[]
    processes: { id: string; label: string; from: string; to: string; component: string; strictlyIsenthalpic?: boolean }[]
    condensedWaterKgPerKgDryAir: number
    chart: {
      rhCurves: { relativeHumidityPercent: number; points: ChartPoint[] }[]
      enthalpyLines: { enthalpyKJkgDryAir: number; points: ChartPoint[] }[]
    }
    checks: Record<string, boolean | number>
  }
}
