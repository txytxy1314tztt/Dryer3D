import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { useTeachingStore } from '../state/teachingStore'
import { processComponentMap } from '../state/teachingStore'
import { useResolvedQuality } from './quality'

type FlowParticlesProps = {
  kind: 'air' | 'refrigerant'
  points: [number, number, number][]
  color: string
  count?: number
  closed?: boolean
  processId?: string
  variant?: 'air' | 'gas' | 'liquid' | 'two-phase'
}

export function FlowParticles({ kind, points, color, count = 8, closed = true, processId, variant = kind === 'air' ? 'air' : 'liquid' }: FlowParticlesProps) {
  const progress = useTeachingStore((state) => state.teachingProgress)
  const circuit = useTeachingStore((state) => state.circuit)
  const selectedProcess = useTeachingStore((state) => state.selectedProcess)
  const selectProcess = useTeachingStore((state) => state.selectProcess)
  const quality = useResolvedQuality()
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), closed),
    [points, closed],
  )
  const visible = circuit === 'both' || circuit === kind
  const emphasized = !selectedProcess || !processId || selectedProcess === processId
  const particleCount = Math.max(3, Math.round(count * (quality === 'high' ? 1 : quality === 'balanced' ? .72 : .45)))

  if (!visible) return null

  return (
    <group>
      {Array.from({ length: particleCount }, (_, index) => {
        const position = curve.getPoint((progress + index / particleCount) % 1)
        const radius = variant === 'gas' ? .046 : variant === 'liquid' ? .03 : variant === 'two-phase' ? (index % 2 ? .05 : .026) : .043
        return (
          <mesh key={index} position={position} scale={emphasized ? 1.15 : .78} onClick={(event) => {
            if (!processId) return
            event.stopPropagation()
            selectProcess(processId, processComponentMap[processId] ?? null)
          }}>
            <sphereGeometry args={[radius, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emphasized ? 1.4 : .25} transparent opacity={emphasized ? 1 : .28} />
          </mesh>
        )
      })}
    </group>
  )
}
