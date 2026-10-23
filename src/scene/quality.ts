import { useMemo } from 'react'
import { useTeachingStore, type QualityLevel } from '../state/teachingStore'

export type ResolvedQuality = Exclude<QualityLevel, 'auto'>
export type DeviceSignals = { memoryGB?: number; logicalCores?: number; reducedMotion?: boolean; devicePixelRatio?: number }

export function resolveQuality(preference: QualityLevel, signals: DeviceSignals): ResolvedQuality {
  if (preference !== 'auto') return preference
  if (signals.reducedMotion || (signals.memoryGB !== undefined && signals.memoryGB <= 4) || (signals.logicalCores !== undefined && signals.logicalCores <= 4)) return 'low'
  if ((signals.memoryGB ?? 8) >= 8 && (signals.logicalCores ?? 8) >= 8 && (signals.devicePixelRatio ?? 1) <= 2) return 'high'
  return 'balanced'
}

export function useResolvedQuality() {
  const preference = useTeachingStore((s) => s.quality)
  return useMemo(() => {
    if (typeof navigator === 'undefined') return resolveQuality(preference, {})
    const extended = navigator as Navigator & { deviceMemory?: number }
    return resolveQuality(preference, {
      memoryGB: extended.deviceMemory,
      logicalCores: navigator.hardwareConcurrency,
      reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
      devicePixelRatio: window.devicePixelRatio,
    })
  }, [preference])
}
