import { useEffect, useState } from 'react'
import type { ThermodynamicData } from './types'

let cache: ThermodynamicData | null = null
let pending: Promise<ThermodynamicData> | null = null

function load() {
  if (cache) return Promise.resolve(cache)
  pending ??= fetch('/data/stage3-thermodynamics.json').then(async (response) => {
    if (!response.ok) throw new Error(`物性数据加载失败：HTTP ${response.status}`)
    const data = await response.json() as ThermodynamicData
    if (data.schemaVersion !== '1.0.0' || data.library.name !== 'CoolProp') {
      throw new Error('物性数据版本或来源不符合预期')
    }
    cache = data
    return data
  })
  return pending
}

export function useThermoData() {
  const [data, setData] = useState<ThermodynamicData | null>(cache)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    load().then((value) => { if (active) setData(value) }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : '物性数据加载失败')
    })
    return () => { active = false }
  }, [])
  return { data, error, loading: !data && !error }
}
