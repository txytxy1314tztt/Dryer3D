import { useEffect } from 'react'
import { useTeachingStore } from '../state/teachingStore'

export function useTeachingClock() {
  const playing = useTeachingStore((state) => state.playing)
  const speed = useTeachingStore((state) => state.speed)
  const advanceProgress = useTeachingStore((state) => state.advanceProgress)

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 100)
      previous = now
      advanceProgress((elapsed / 12_000) * speed)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [advanceProgress, playing, speed])
}
