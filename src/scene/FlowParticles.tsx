import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { useTeachingStore } from '../state/teachingStore'

type FlowParticlesProps = {
  kind: 'air' | 'refrigerant'
  points: [number, number, number][]
  color: string
  count?: number
}

export function FlowParticles({ kind, points, color, count = 8 }: FlowParticlesProps) {
  const progress = useTeachingStore((state) => state.teachingProgress)
  const circuit = useTeachingStore((state) => state.circuit)
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), true),
    [points],
  )
  const visible = circuit === 'both' || circuit === kind

  if (!visible) return null

  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const position = curve.getPoint((progress + index / count) % 1)
        return (
          <mesh key={index} position={position}>
            <sphereGeometry args={[kind === 'air' ? 0.045 : 0.035, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
          </mesh>
        )
      })}
    </group>
  )
}
