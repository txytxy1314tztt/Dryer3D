import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'
import type { DryerType } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'
import { FlowParticles } from './FlowParticles'

type PartProps = {
  name: string
  process?: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  shape?: 'box' | 'cylinder'
}

function Part({ name, process, position, size, color, shape = 'box' }: PartProps) {
  const selected = useTeachingStore((state) => state.selectedComponent === name)
  const selectComponent = useTeachingStore((state) => state.selectComponent)
  return (
    <group position={position}>
      <mesh
        data-component={name}
        onClick={(event) => {
          event.stopPropagation()
          selectComponent(name, process ?? null)
        }}
        scale={selected ? 1.08 : 1}
      >
        {shape === 'box' ? (
          <boxGeometry args={size} />
        ) : (
          <cylinderGeometry args={[size[0], size[0], size[1], 28]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={selected ? color : '#000000'}
          emissiveIntensity={selected ? 0.35 : 0}
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>
    </group>
  )
}

function MachineParts({ machine }: { machine: DryerType }) {
  const viewMode = useTeachingStore((state) => state.viewMode)
  const progress = useTeachingStore((state) => state.teachingProgress)
  const drumRef = useRef<Group>(null)
  const shellOpacity = viewMode === 'exterior' ? 0.82 : viewMode === 'transparent' ? 0.18 : 0.08
  const exploded = viewMode === 'exploded' ? 0.8 : 0

  if (drumRef.current) drumRef.current.rotation.z = progress * Math.PI * 2

  return (
    <group rotation={[0, -0.22, 0]}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3.4, 3.6, 2.4]} />
        <meshPhysicalMaterial
          color="#7f96a3"
          transparent
          opacity={shellOpacity}
          transmission={viewMode === 'transparent' ? 0.28 : 0}
          depthWrite={viewMode === 'exterior'}
          side={2}
        />
      </mesh>

      <group ref={drumRef} position={[0, 0.55 + exploded * 0.15, 0.1 + exploded]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} onClick={() => useTeachingStore.getState().selectComponent('drum', 'humidifying')}>
          <cylinderGeometry args={[1.18, 1.18, 1.65, 48, 1, true]} />
          <meshStandardMaterial color="#b8c7ce" metalness={0.72} roughness={0.28} side={2} />
        </mesh>
        <mesh position={[0, 0, 0.85]}>
          <torusGeometry args={[1.12, 0.065, 12, 48]} />
          <meshStandardMaterial color="#58e0b6" emissive="#143b36" />
        </mesh>
      </group>

      <Part name="fan" position={[1.15 + exploded, -1.25, 0.45]} size={[0.34, 0.28, 0.34]} color="#8694a3" shape="cylinder" />

      {machine === 'vented' && (
        <>
          <Part name="heater" position={[-0.9 - exploded, -1.25, 0.25]} size={[1.05, 0.35, 0.65]} color="#ff9f43" />
          <FlowParticles kind="air" color="#ff9f43" points={[[-1.5,-1.25,0.2],[-0.6,-1.2,0.2],[0.9,-0.75,0.2],[1.25,0.4,0.2],[0.6,1.2,0.2],[-0.5,1.2,0.2],[-1.2,0.2,0.2]]} />
        </>
      )}

      {machine === 'condenser' && (
        <>
          <Part name="heater" position={[-0.9 - exploded, -1.25, 0.25]} size={[0.85, 0.35, 0.65]} color="#ff9f43" />
          <Part name="airCondenser" position={[0.1, -1.25 - exploded * 0.4, 0.15]} size={[0.95, 0.52, 0.82]} color="#55c2ff" />
          <FlowParticles kind="air" color="#55c2ff" points={[[-1.25,-1.1,0.15],[-0.6,-1.35,0.15],[0.35,-1.3,0.15],[1.25,-0.65,0.15],[1.1,0.65,0.15],[0.2,1.2,0.15],[-1.1,0.55,0.15]]} />
        </>
      )}

      {machine === 'heat-pump' && (
        <>
          <Part name="compressor" process="1-2" position={[1.1 + exploded, -1.15, -0.55]} size={[0.34, 0.78, 0.34]} color="#27323b" shape="cylinder" />
          <Part name="condenser" process="2-3" position={[-0.82 - exploded, -1.15, 0.25]} size={[0.72, 0.55, 0.72]} color="#ff6b5e" />
          <Part name="evaporator" process="4-1" position={[0.02, -1.15 - exploded * 0.35, 0.25]} size={[0.72, 0.55, 0.72]} color="#55c2ff" />
          <Part name="capillary" process="3-4" position={[0.58, -1.46, 0.24]} size={[0.3, 0.18, 0.18]} color="#f5cf66" />
          <FlowParticles kind="air" color="#6fd7ff" points={[[-1.3,-0.95,0.15],[-0.65,-1.3,0.15],[0.2,-1.3,0.15],[1.25,-0.55,0.15],[1.05,0.8,0.15],[0,1.25,0.15],[-1.15,0.55,0.15]]} />
          <FlowParticles kind="refrigerant" color="#f36b62" count={10} points={[[1.1,-1.1,-0.55],[0.45,-1.55,-0.55],[-0.8,-1.3,-0.45],[-0.7,-1.55,-0.25],[0.58,-1.5,-0.25],[0.1,-1.25,-0.45],[0.7,-1.5,-0.55]]} />
        </>
      )}
    </group>
  )
}

export function PlaceholderMachine({ machine }: { machine: DryerType }) {
  return (
    <>
      <color attach="background" args={['#07121a']} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#d7f4ff" />
      <pointLight position={[-4, 1, 2]} intensity={14} color="#1d7f9b" distance={8} />
      <gridHelper args={[12, 24, '#1b5060', '#102832']} position={[0, -1.72, 0]} />
      <MachineParts machine={machine} />
      <OrbitControls makeDefault enableDamping minDistance={4} maxDistance={10} target={[0, 0, 0]} />
    </>
  )
}
