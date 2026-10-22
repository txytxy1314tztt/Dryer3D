import { processComponentMap, useTeachingStore } from '../state/teachingStore'

const segments = [
  { id: 'heating', label: '加热', d: 'M91 140L247 140', x: 166, y: 130 },
  { id: 'humidifying', label: '滚筒吸湿', d: 'M247 140L194 67', x: 238, y: 93 },
  { id: 'dehumidifying', label: '冷却除湿', d: 'M194 67L91 140', x: 119, y: 91 },
]

export function PsychrometricPlaceholder() {
  const selectedProcess = useTeachingStore((state) => state.selectedProcess)
  const selectProcess = useTeachingStore((state) => state.selectProcess)
  return (
    <section className="chart-card" aria-labelledby="psych-title">
      <div className="chart-title-row">
        <div><span className="eyebrow">PROCESS AIR LOOP</span><h3 id="psych-title">焓湿图 <small>Psychrometric chart</small></h3></div>
        <span className="placeholder-badge">教学路径占位</span>
      </div>
      <svg viewBox="0 0 340 190" role="img" aria-label="湿空气焓湿图骨架占位">
        <defs><linearGradient id="psych-bg" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#0d2832" /><stop offset="1" stopColor="#123e49" /></linearGradient></defs>
        <path fill="url(#psych-bg)" d="M42 162V28H294C281 65 258 110 226 162Z" />
        {[65, 90, 115, 140].map((y) => <path key={y} className="psych-grid" d={`M48 ${y}H270`} />)}
        {[80, 120, 160, 200, 240].map((x) => <path key={x} className="psych-grid" d={`M${x} 154Q${x + 38} 86 282 38`} />)}
        {segments.map((segment) => (
          <g
            key={segment.id}
            className={selectedProcess === segment.id ? 'segment active' : 'segment'}
            onClick={() => selectProcess(segment.id, processComponentMap[segment.id])}
            role="button"
            tabIndex={0}
            data-testid={`psych-${segment.id}`}
          >
            <path d={segment.d} />
            <text x={segment.x} y={segment.y}>{segment.label}</text>
          </g>
        ))}
        <text x="12" y="34">W</text><text x="298" y="180">Tdb</text>
        <text className="chart-watermark" x="62" y="179">大气压与状态点将在阶段 3 明示</text>
      </svg>
    </section>
  )
}
