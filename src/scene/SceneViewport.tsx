import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { getMachine } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'
import { PlaceholderMachine } from './PlaceholderMachine'

export function SceneViewport() {
  const machine = useTeachingStore((state) => state.machine)
  const definition = getMachine(machine)
  return (
    <section className="scene-panel" aria-label="三维教学场景">
      <div className="scene-heading">
        <div>
          <span className="eyebrow">PROGRAMMATIC PLACEHOLDER</span>
          <h2>{definition.label} <span>{definition.english}</span></h2>
        </div>
        <span className="status-chip">教学示意 · 非真实尺寸</span>
      </div>
      <div className="canvas-wrap" data-testid="scene-canvas">
        <Canvas camera={{ position: [5.4, 3.6, 6.6], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <PlaceholderMachine machine={machine} />
          </Suspense>
        </Canvas>
        <div className="scene-legend">
          <span><i className="legend-dot air" />空气 Air</span>
          <span><i className="legend-dot refrigerant" />冷媒 Refrigerant</span>
          <span>拖拽旋转 · 滚轮缩放 · 点击部件</span>
        </div>
      </div>
    </section>
  )
}
