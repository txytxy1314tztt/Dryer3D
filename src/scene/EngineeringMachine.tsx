import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CanvasTexture, CatmullRomCurve3, DoubleSide, Group, LinearFilter,
  MeshPhysicalMaterial, TubeGeometry, Vector3,
} from 'three'
import type { DryerType } from '../models/catalog'
import { componentDefinitions, type ComponentId } from '../models/engineering'
import { useTeachingStore, type CameraPreset } from '../state/teachingStore'
import { FlowParticles } from './FlowParticles'

type V3 = [number, number, number]

const colors = {
  steel: '#93a6ae', dark: '#17242b', airHot: '#ffad52', airWet: '#5bc8ff',
  refrigerantHot: '#ef665b', refrigerantCold: '#4fbbe8', water: '#4baee8', copper: '#c87942',
}

function LabelSprite({ id, position, priority = false, hovered = false }: { id: ComponentId; position: V3; priority?: boolean; hovered?: boolean }) {
  const labelMode = useTeachingStore((s) => s.labelMode)
  const selected = useTeachingStore((s) => s.selectedComponent === id)
  const definition = componentDefinitions[id]
  const visible = labelMode !== 'off' && (selected || (labelMode === 'key' && priority) || (labelMode === 'hover' && hovered))
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 96
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(4,17,20,.92)'
    ctx.strokeStyle = '#58e0b6'
    ctx.lineWidth = 3
    ctx.fillRect(3, 3, 506, 90)
    ctx.strokeRect(3, 3, 506, 90)
    ctx.fillStyle = '#eafff8'
    ctx.font = '600 28px Segoe UI, Microsoft YaHei UI, sans-serif'
    ctx.fillText(definition.label, 20, 40)
    ctx.fillStyle = '#8db1b9'
    ctx.font = '20px Segoe UI, sans-serif'
    ctx.fillText(definition.english, 20, 72)
    const result = new CanvasTexture(canvas)
    result.minFilter = LinearFilter
    return result
  }, [definition])
  useEffect(() => () => texture.dispose(), [texture])
  if (!visible) return null
  return <sprite position={position} scale={[1.28, .24, 1]} renderOrder={10}>
    <spriteMaterial map={texture} transparent depthTest={false} />
  </sprite>
}

type PartProps = {
  id: ComponentId
  position: V3
  explode?: V3
  size?: V3
  color?: string
  shape?: 'box' | 'cylinder'
  rotation?: V3
  priority?: boolean
  children?: React.ReactNode
}

function InteractivePart({ id, position, explode = [0, 0, 0], size = [.5, .5, .5], color = colors.steel, shape = 'box', rotation = [0, 0, 0], priority, children }: PartProps) {
  const ref = useRef<Group>(null)
  const viewMode = useTeachingStore((s) => s.viewMode)
  const selected = useTeachingStore((s) => s.selectedComponent === id)
  const select = useTeachingStore((s) => s.selectComponent)
  const [hovered, setHovered] = useState(false)
  const definition = componentDefinitions[id]
  useFrame((_, delta) => {
    const amount = viewMode === 'exploded' ? 1 : 0
    const target = new Vector3(position[0] + explode[0] * amount, position[1] + explode[1] * amount, position[2] + explode[2] * amount)
    ref.current?.position.lerp(target, 1 - Math.exp(-delta * 5.5))
  })
  return <group ref={ref} position={position} rotation={rotation}>
    <group
      onClick={(e) => { e.stopPropagation(); select(id, definition.process ?? null) }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
      scale={selected ? 1.045 : hovered ? 1.025 : 1}
    >
      {children ?? <mesh castShadow receiveShadow>
        {shape === 'box' ? <boxGeometry args={size} /> : <cylinderGeometry args={[size[0], size[0], size[1], 36]} />}
        <meshStandardMaterial color={color} metalness={.48} roughness={.36} emissive={selected ? color : '#000'} emissiveIntensity={selected ? .32 : 0} />
      </mesh>}
    </group>
    <LabelSprite id={id} position={[0, size[1] * .7 + .26, .15]} priority={priority} hovered={hovered} />
  </group>
}

function Tube({ points, color, radius = .035, opacity = 1 }: { points: V3[]; color: string; radius?: number; opacity?: number }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points])
  const geometry = useMemo(() => new TubeGeometry(curve, 80, radius, 8, false), [curve, radius])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry}><meshStandardMaterial color={color} metalness={.25} roughness={.38} transparent opacity={opacity} /></mesh>
}

function FanGeometry({ color = '#81949c' }: { color?: string }) {
  return <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh><cylinderGeometry args={[.34, .34, .16, 32]} /><meshStandardMaterial color="#273840" metalness={.6} /></mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} rotation={[0, 0, i * Math.PI / 3]} position={[.13, 0, .1]}>
      <boxGeometry args={[.3, .07, .035]} /><meshStandardMaterial color={color} /></mesh>)}
  </group>
}

function HeatExchanger({ hot }: { hot: boolean }) {
  const tint = hot ? colors.refrigerantHot : colors.refrigerantCold
  return <group>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[(i - 5) * .065, 0, 0]}>
      <boxGeometry args={[.026, .68, .62]} /><meshStandardMaterial color={i % 2 ? '#9aaeb5' : tint} metalness={.6} roughness={.3} /></mesh>)}
    <Tube points={[[-.42, -.24, .34], [-.2, -.24, .34], [.2, -.08, .34], [-.2, .1, .34], [.2, .27, .34], [.42, .27, .34]]} color={colors.copper} radius={.025} />
  </group>
}

function Drum() {
  const ref = useRef<Group>(null)
  const progress = useTeachingStore((s) => s.teachingProgress)
  useFrame(() => { if (ref.current) ref.current.rotation.z = progress * Math.PI * 2 })
  return <InteractivePart id="drum" position={[0, .5, .05]} explode={[0, .45, 1.35]} size={[1.15, 1.15, 1.15]} priority>
    <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[1.14, 1.14, 1.55, 48, 1, true]} /><meshStandardMaterial color="#aebdc3" metalness={.75} roughness={.25} side={DoubleSide} /></mesh>
      <mesh position={[0, .8, 0]}><torusGeometry args={[1.08, .06, 10, 48]} /><meshStandardMaterial color="#d8e3e6" metalness={.65} /></mesh>
      {[-.45, .1, .6].map((z) => <mesh key={z} position={[0, z, 0]}><torusGeometry args={[1.12, .022, 8, 48]} /><meshStandardMaterial color="#5f747c" /></mesh>)}
    </group>
  </InteractivePart>
}

function Cabinet() {
  const mode = useTeachingStore((s) => s.viewMode)
  const materials = useRef<MeshPhysicalMaterial[]>([])
  const targetOpacity = mode === 'exterior' ? .94 : mode === 'transparent' ? .16 : mode === 'exploded' ? .28 : .08
  useFrame((_, delta) => materials.current.forEach((m) => { m.opacity += (targetOpacity - m.opacity) * (1 - Math.exp(-delta * 5)) }))
  const panels: { p: V3; s: V3; hideInSection?: boolean }[] = [
    { p: [0, 0, -1.18], s: [3.35, 3.55, .08] }, { p: [0, 1.74, 0], s: [3.35, .08, 2.4] },
    { p: [0, -1.74, 0], s: [3.35, .08, 2.4] }, { p: [-1.64, 0, 0], s: [.08, 3.55, 2.4] },
    { p: [1.64, 0, 0], s: [.08, 3.55, 2.4], hideInSection: true }, { p: [0, 0, 1.18], s: [3.35, 3.55, .06], hideInSection: true },
  ]
  return <group>{panels.map((panel, i) => {
    const hidden = (mode === 'section' || mode === 'internal') && panel.hideInSection
    return <mesh key={i} position={panel.p} visible={!hidden} receiveShadow>
      <boxGeometry args={panel.s} />
      <meshPhysicalMaterial ref={(m) => { if (m) materials.current[i] = m }} color="#6d828b" transparent opacity={targetOpacity} depthWrite={targetOpacity > .5} roughness={.35} metalness={.5} side={DoubleSide} />
    </mesh>
  })}</group>
}

const ventedAir: V3[] = [[-1.55,-1.2,.3],[-.8,-1.25,.3],[0,-.65,.3],[.9,.5,.3],[.2,1.2,.3],[-.9,.65,.3],[.95,-.8,.3],[1.75,-.55,.3]]
const condenserAir: V3[] = [[-.9,-1.25,.32],[-.5,-.65,.32],[.9,.35,.32],[.1,1.2,.32],[-.95,.55,.32],[.8,-.82,.32],[.15,-1.35,.32]]
const airHeating: V3[] = [[-.86,-1.28,.38],[-.62,-.72,.38],[-.48,-.25,.38],[-.18,.05,.38]]
const airHumidifying: V3[] = [[-.18,.05,.38],[.72,.55,.38],[.22,1.2,.38],[-.78,.62,.38]]
const airDehumidifying: V3[] = [[-.78,.62,.38],[-.48,-.15,.38],[.08,-1.22,.38],[.92,-1.2,.38],[-.86,-1.28,.38]]
const refCompression: V3[] = [[1.15,-1.15,-.58],[.82,-1.48,-.55],[-.15,-1.5,-.42],[-.86,-1.18,.38]]
const refCondensation: V3[] = [[-.86,-1.18,.38],[-1.05,-1.32,.18],[-.78,-1.5,-.18],[-.4,-1.52,-.38]]
const refExpansion: V3[] = [[-.4,-1.52,-.38],[-.18,-1.48,-.18],[.08,-1.18,.38]]
const refEvaporation: V3[] = [[.08,-1.18,.38],[.42,-1.4,.05],[.76,-1.35,-.45],[1.15,-1.15,-.58]]

function HeatExchangeInset() {
  const selected = useTeachingStore((s) => s.selectedComponent)
  if (selected !== 'condenser' && selected !== 'evaporator') return null
  const condenser = selected === 'condenser'
  return <group position={[2.35,.45,-.35]} scale={.72}>
    <mesh position={[0,0,0]}><boxGeometry args={[1.5,.08,1]} /><meshStandardMaterial color="#b9c7cb" metalness={.7} /></mesh>
    <mesh position={[0,.48,0]}><boxGeometry args={[1.6,.55,.9]} /><meshPhysicalMaterial color={condenser ? colors.refrigerantHot : colors.airWet} transparent opacity={.18} /></mesh>
    <mesh position={[0,-.48,0]}><boxGeometry args={[1.6,.55,.9]} /><meshPhysicalMaterial color={condenser ? colors.airWet : colors.refrigerantCold} transparent opacity={.18} /></mesh>
    <FlowParticles kind={condenser ? 'refrigerant' : 'air'} processId={condenser ? '2-3' : 'dehumidifying'} variant={condenser ? 'gas' : 'air'} color={condenser ? colors.refrigerantHot : colors.airWet} points={[[-.65,.48,0],[.65,.48,0]]} count={7} closed={false} />
    <FlowParticles kind={condenser ? 'air' : 'refrigerant'} processId={condenser ? 'heating' : '4-1'} variant={condenser ? 'air' : 'two-phase'} color={condenser ? colors.airHot : colors.refrigerantCold} points={[[.65,-.48,0],[-.65,-.48,0]]} count={7} closed={false} />
    {[-.45,0,.45].map((z) => <group key={z} position={[0,0,z]} rotation={[0,0,Math.PI]}>
      <mesh position={[0,.18,0]}><cylinderGeometry args={[.025,.025,.3,8]} /><meshStandardMaterial color="#ffd166" emissive="#c88b22" /></mesh>
      <mesh position={[0,.36,0]}><coneGeometry args={[.07,.14,8]} /><meshStandardMaterial color="#ffd166" emissive="#c88b22" /></mesh>
    </group>)}
  </group>
}

function CommonParts() {
  return <>
    <Cabinet /><Drum />
    <InteractivePart id="lint-filter" position={[0,-.62,.95]} explode={[0,0,1.2]} size={[.75,.12,.18]} color="#d1b96c" />
    <InteractivePart id="fan" position={[.95,-1.12,.55]} explode={[1.1,0,.25]} size={[.35,.35,.35]}><FanGeometry /></InteractivePart>
  </>
}

function VentedModel() {
  return <>
    <CommonParts />
    <InteractivePart id="heater" position={[-.87,-1.2,.4]} explode={[-1.15,0,.3]} size={[.75,.32,.52]} color={colors.airHot} priority />
    <InteractivePart id="exhaust" position={[1.45,-.62,-.2]} explode={[1,0,0]} size={[.35,.35,.35]} priority>
      <Tube points={[[0,0,0],[.45,.1,0],[.9,.1,0]]} color="#6d8790" radius={.18} />
    </InteractivePart>
    <Tube points={ventedAir} color="#315c69" radius={.1} opacity={.55} />
    <FlowParticles kind="air" color={colors.airHot} points={ventedAir} count={16} closed={false} />
  </>
}

function CondenserModel() {
  return <>
    <CommonParts />
    <InteractivePart id="heater" position={[-.88,-1.22,.42]} explode={[-1.15,0,.3]} size={[.65,.28,.5]} color={colors.airHot} priority />
    <InteractivePart id="air-condenser" position={[.08,-1.24,.25]} explode={[0,-.9,.4]} size={[.7,.62,.72]} priority><HeatExchanger hot={false} /></InteractivePart>
    <InteractivePart id="cooling-fan" position={[1.18,-1.25,-.48]} explode={[1,0,-.3]} size={[.3,.3,.3]}><FanGeometry color="#70c9ed" /></InteractivePart>
    <InteractivePart id="water-tray" position={[.05,-1.63,.28]} explode={[0,-.7,.4]} size={[.9,.08,.65]} color="#3687aa" />
    <InteractivePart id="drain" position={[-.45,-1.62,.25]} explode={[-.7,-.5,0]} size={[.25,.25,.25]}><Tube points={[[0,0,0],[-.2,-.25,0],[-.45,-.35,.1]]} color={colors.water} radius={.045} /></InteractivePart>
    <Tube points={condenserAir} color="#315c69" radius={.1} opacity={.55} />
    <FlowParticles kind="air" color={colors.airWet} points={condenserAir} count={16} />
    <FlowParticles kind="air" color="#8dd9f2" points={[[1.7,-1.2,-.55],[1.2,-1.2,-.5],[.55,-1.15,-.45],[-.1,-1.12,-.48]]} count={7} closed={false} />
  </>
}

function HeatPumpModel() {
  return <>
    <CommonParts />
    <InteractivePart id="compressor" position={[1.15,-1.18,-.58]} explode={[1.1,0,-.45]} size={[.34,.74,.34]} shape="cylinder" color="#27333a" priority />
    <InteractivePart id="condenser" position={[-.86,-1.18,.38]} explode={[-1.05,0,.55]} size={[.72,.7,.7]} priority><HeatExchanger hot /></InteractivePart>
    <InteractivePart id="evaporator" position={[.08,-1.18,.38]} explode={[0,-.85,.55]} size={[.72,.7,.7]} priority><HeatExchanger hot={false} /></InteractivePart>
    <InteractivePart id="capillary" position={[-.4,-1.52,-.38]} explode={[-.4,-.65,-.4]} size={[.28,.18,.28]} priority>
      <group>{[0,1,2,3].map((i) => <mesh key={i} position={[0,i*.045,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.18,.018,8,24]} /><meshStandardMaterial color="#e2b85b" metalness={.5} /></mesh>)}</group>
    </InteractivePart>
    <InteractivePart id="water-tray" position={[.08,-1.62,.42]} explode={[0,-.7,.5]} size={[.88,.07,.68]} color="#3687aa" />
    <InteractivePart id="drain" position={[-.35,-1.62,.42]} explode={[-.7,-.5,0]} size={[.2,.2,.2]}><Tube points={[[0,0,0],[-.2,-.22,0],[-.42,-.34,.08]]} color={colors.water} radius={.045} /></InteractivePart>
    {[airHeating,airHumidifying,airDehumidifying].map((points, index) => <Tube key={`air-${index}`} points={points} color="#315c69" radius={.1} opacity={.55} />)}
    <FlowParticles kind="air" processId="heating" color={colors.airHot} points={airHeating} count={7} closed={false} />
    <FlowParticles kind="air" processId="humidifying" color="#7fd0ee" points={airHumidifying} count={9} closed={false} />
    <FlowParticles kind="air" processId="dehumidifying" color={colors.airWet} points={airDehumidifying} count={9} closed={false} />
    <Tube points={refCompression} color="#d86650" radius={.045} /><Tube points={refCondensation} color="#d88b4e" radius={.045} /><Tube points={refExpansion} color="#83b8ce" radius={.045} /><Tube points={refEvaporation} color="#4eaed4" radius={.045} />
    <FlowParticles kind="refrigerant" processId="1-2" variant="gas" color="#ff6b55" points={refCompression} count={6} closed={false} />
    <FlowParticles kind="refrigerant" processId="2-3" variant="gas" color="#ff9a52" points={refCondensation} count={7} closed={false} />
    <FlowParticles kind="refrigerant" processId="3-4" variant="liquid" color="#e6c967" points={refExpansion} count={5} closed={false} />
    <FlowParticles kind="refrigerant" processId="4-1" variant="two-phase" color="#55c2ff" points={refEvaporation} count={8} closed={false} />
    <HeatExchangeInset />
  </>
}

const cameraPositions: Record<CameraPreset, { position: V3; target: V3 }> = {
  perspective: { position: [5.4,3.5,6.4], target: [0,0,0] }, front: { position: [0,.2,7.4], target: [0,0,0] },
  side: { position: [7,.2,0], target: [0,0,0] }, top: { position: [.1,7,.1], target: [0,-.25,0] },
  internal: { position: [4,.4,4.6], target: [0,-.45,.15] },
}

function CameraRig() {
  const preset = useTeachingStore((s) => s.cameraPreset)
  const controls = useRef<any>(null)
  const { camera } = useThree()
  const active = useRef(true)
  useEffect(() => { active.current = true }, [preset])
  useFrame((_, delta) => {
    if (!active.current) return
    const config = cameraPositions[preset]
    const factor = 1 - Math.exp(-delta * 4.5)
    camera.position.lerp(new Vector3(...config.position), factor)
    controls.current?.target.lerp(new Vector3(...config.target), factor)
    controls.current?.update()
    if (camera.position.distanceTo(new Vector3(...config.position)) < .025) active.current = false
  })
  return <OrbitControls ref={controls} makeDefault enableDamping minDistance={3.4} maxDistance={11} target={[0,0,0]} />
}

export function EngineeringMachine({ machine }: { machine: DryerType }) {
  return <>
    <color attach="background" args={['#07121a']} />
    <ambientLight intensity={1.25} />
    <directionalLight position={[4,6,5]} intensity={2.5} color="#dcf5ff" castShadow />
    <pointLight position={[-4,1,2]} intensity={12} color="#1d7f9b" distance={8} />
    <gridHelper args={[12,24,'#1b5060','#102832']} position={[0,-1.74,0]} />
    <group rotation={[0,-.18,0]} onPointerMissed={() => useTeachingStore.getState().selectComponent(null)}>
      {machine === 'vented' && <VentedModel />}
      {machine === 'condenser' && <CondenserModel />}
      {machine === 'heat-pump' && <HeatPumpModel />}
    </group>
    <CameraRig />
  </>
}
