import { lazy, Suspense } from 'react'
import { PhChart } from './charts/PhChart'
import { PsychrometricChart } from './charts/PsychrometricChart'
import { ControlRail } from './components/ControlRail'
import { Header } from './components/Header'
import { ParameterPanel } from './components/ParameterPanel'
import { TransportBar } from './components/TransportBar'
import { useTeachingClock } from './animations/useTeachingClock'

const SceneViewport = lazy(() =>
  import('./scene/SceneViewport').then((module) => ({ default: module.SceneViewport })),
)

export function App() {
  useTeachingClock()
  return (
    <div className="app-shell">
      <Header />
      <main className="workbench">
        <ControlRail />
        <div className="center-stage">
          <Suspense fallback={<div className="scene-loading">正在加载 WebGL 教学场景…</div>}>
            <SceneViewport />
          </Suspense>
          <TransportBar />
          <div className="chart-grid">
            <PhChart />
            <PsychrometricChart />
          </div>
        </div>
        <ParameterPanel />
      </main>
      <footer>
        <span>阶段 3 物理联动候选 · 2026-10-23</span>
        <span>SI units · 中文 UI / English terminology</span>
        <span className="footer-warning">非实机标定性能仿真</span>
      </footer>
    </div>
  )
}
