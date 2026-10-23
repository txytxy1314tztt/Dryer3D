import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { getMachine } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'
import { EngineeringMachine } from './EngineeringMachine'
import type { CameraPreset, LabelMode } from '../state/teachingStore'

export function SceneViewport() {
  const machine = useTeachingStore((state) => state.machine)
  const cameraPreset = useTeachingStore((state) => state.cameraPreset)
  const setCameraPreset = useTeachingStore((state) => state.setCameraPreset)
  const labelMode = useTeachingStore((state) => state.labelMode)
  const selectedComponent = useTeachingStore((state) => state.selectedComponent)
  const setLabelMode = useTeachingStore((state) => state.setLabelMode)
  const [expanded, setExpanded] = useState(false)
  const [diagnostics, setDiagnostics] = useState('初始化 WebGL…')
  const definition = getMachine(machine)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <section className={`scene-panel ${expanded ? 'scene-expanded' : ''}`} aria-label="三维教学场景">
      <div className="scene-heading">
        <div>
          <span className="eyebrow">PROGRAMMATIC ENGINEERING MODEL</span>
          <h2>{definition.label} <span>{definition.english}</span></h2>
        </div>
        <div className="scene-actions"><span className="status-chip">教学示意 · 非真实尺寸</span><button data-testid="fullscreen-toggle" onClick={() => setExpanded((v) => !v)}>{expanded ? '退出全屏' : '3D 全屏'}</button></div>
      </div>
      <div className="canvas-wrap" data-testid="scene-canvas">
        <Canvas camera={{ position: [5.4, 3.6, 6.6], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => setDiagnostics(`WebGL ${gl.capabilities.isWebGL2 ? '2' : '1'} · DPR ≤ 1.5`)}>
          <Suspense fallback={null}>
            <EngineeringMachine machine={machine} />
          </Suspense>
        </Canvas>
        <div className="view-toolbar" aria-label="相机与标注">
          <div>{(['perspective','front','side','top','internal'] as CameraPreset[]).map((preset) => <button key={preset} data-testid={`camera-${preset}`} className={cameraPreset === preset ? 'active' : ''} onClick={() => setCameraPreset(preset)}>{{perspective:'透视',front:'正视',side:'侧视',top:'俯视',internal:'内部'}[preset]}</button>)}</div>
          <select aria-label="标注模式" value={labelMode} onChange={(e) => setLabelMode(e.target.value as LabelMode)}><option value="key">固定关键</option><option value="hover">悬停标注</option><option value="selected">点击选中</option><option value="off">关闭标注</option></select>
        </div>
        <div className="scene-legend">
          <span><i className="legend-dot air" />空气 Air</span>
          <span><i className="legend-dot refrigerant" />冷媒 Refrigerant</span>
          <span>拖拽旋转 · 滚轮缩放 · 点击部件</span>
          <span>{diagnostics}</span>
        </div>
        {(selectedComponent === 'condenser' || selectedComponent === 'evaporator') && <div className="heat-exchange-note" data-testid="heat-exchange-detail"><strong>{selectedComponent === 'condenser' ? '冷凝器局部换热' : '蒸发器局部换热'}</strong><span>{selectedComponent === 'condenser' ? '冷媒 → 壁面 → 空气' : '湿空气 → 壁面 → 冷媒'}</span><small>间接换热 · 两流体不混合</small></div>}
      </div>
    </section>
  )
}
