import { processComponentMap, useTeachingStore } from '../state/teachingStore'

const points = [
  { id: '1', process: '1-2', x: 222, y: 142 },
  { id: '2', process: '2-3', x: 276, y: 62 },
  { id: '3', process: '3-4', x: 103, y: 66 },
  { id: '4', process: '4-1', x: 104, y: 142 },
]

export function PhPlaceholder() {
  const selectedProcess = useTeachingStore((state) => state.selectedProcess)
  const selectProcess = useTeachingStore((state) => state.selectProcess)
  return (
    <section className="chart-card" aria-labelledby="ph-title">
      <div className="chart-title-row">
        <div><span className="eyebrow">REFRIGERANT LOOP</span><h3 id="ph-title">P-h 图 <small>Pressure–enthalpy</small></h3></div>
        <span className="placeholder-badge">无物性数值</span>
      </div>
      <svg viewBox="0 0 340 190" role="img" aria-label="R134a P-h 图骨架占位">
        <path className="axis" d="M42 18V162H320M42 18l-4 8M320 162l-8-4" />
        <text x="12" y="22">lg P</text><text x="303" y="181">h</text>
        <path className="dome" d="M74 151C82 70 133 35 184 45C228 54 239 104 248 151" />
        <path className="cycle" d="M222 142L276 62L103 66L104 142Z" />
        {points.map((point) => (
          <g
            key={point.id}
            className={selectedProcess === point.process ? 'point active' : 'point'}
            onClick={() => selectProcess(point.process, processComponentMap[point.process])}
            role="button"
            tabIndex={0}
            data-testid={`ph-${point.process}`}
          >
            <circle cx={point.x} cy={point.y} r="8" />
            <text x={point.x + 11} y={point.y - 7}>{point.id}</text>
          </g>
        ))}
        <text className="chart-watermark" x="88" y="178">R134a 数据将在阶段 3 由 CoolProp 生成</text>
      </svg>
    </section>
  )
}
