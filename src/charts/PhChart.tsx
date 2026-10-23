import { processComponentMap, useTeachingStore } from '../state/teachingStore'
import { useThermoData } from '../thermo/useThermoData'

const width = 340
const height = 190
const bounds = { left: 45, right: 326, top: 20, bottom: 158 }
const hDomain: [number, number] = [150, 500]
const pDomain: [number, number] = [0.12, 4.5]
const x = (h: number) => bounds.left + ((h - hDomain[0]) / (hDomain[1] - hDomain[0])) * (bounds.right - bounds.left)
const y = (p: number) => bounds.bottom - ((Math.log10(p) - Math.log10(pDomain[0])) / (Math.log10(pDomain[1]) - Math.log10(pDomain[0]))) * (bounds.bottom - bounds.top)
const path = (points: { enthalpyKJkg: number; pressureMPa: number }[]) => points.map((point, index) => `${index ? 'L' : 'M'}${x(point.enthalpyKJkg).toFixed(1)} ${y(point.pressureMPa).toFixed(1)}`).join(' ')

export function PhChart() {
  const { data, error } = useThermoData()
  const selectedProcess = useTeachingStore((state) => state.selectedProcess)
  const selectProcess = useTeachingStore((state) => state.selectProcess)
  if (error) return <section className="chart-card chart-error">{error}</section>
  if (!data) return <section className="chart-card chart-loading">正在加载 CoolProp 数据…</section>
  const cycle = data.refrigerant.processes
  const states = Object.fromEntries(data.refrigerant.states.map((item) => [item.id, item]))
  return <section className="chart-card" aria-labelledby="ph-title">
    <div className="chart-title-row">
      <div><span className="eyebrow">R134a · COOLPROP {data.library.version}</span><h3 id="ph-title">P-h 图 <small>Pressure–enthalpy</small></h3></div>
      <span className="placeholder-badge verified">物性校验通过</span>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="由 CoolProp 数据生成的 R134a 压焓图">
      <path className="axis" d={`M${bounds.left} ${bounds.top}V${bounds.bottom}H${bounds.right}`} />
      {[.2,.5,1,2,4].map((p) => <g key={p}><path className="chart-grid-line" d={`M${bounds.left} ${y(p)}H${bounds.right}`} /><text x="8" y={y(p)+3}>{p} MPa</text></g>)}
      {[200,300,400,500].map((h) => <g key={h}><path className="chart-grid-line" d={`M${x(h)} ${bounds.top}V${bounds.bottom}`} /><text x={x(h)-10} y="174">{h}</text></g>)}
      <path className="dome-area" d={`${path(data.refrigerant.saturationDome.liquid)} ${path([...data.refrigerant.saturationDome.vapor].reverse()).replace(/^M/, 'L')} Z`} />
      <path className="dome" d={path(data.refrigerant.saturationDome.liquid)} />
      <path className="dome" d={path(data.refrigerant.saturationDome.vapor)} />
      <text x="166" y="150" className="phase-label">两相区 two-phase</text>
      {cycle.map((process) => {
        const from = states[process.from]
        const to = states[process.to]
        const active = selectedProcess === process.id
        const d = `M${x(from.enthalpyKJkg)} ${y(from.pressureMPa)}L${x(to.enthalpyKJkg)} ${y(to.pressureMPa)}`
        return <g key={process.id} onClick={() => selectProcess(process.id, process.component)}>
          <path data-testid={`ph-process-${process.id}`} className="chart-hit" d={d} />
          <path className={active ? 'cycle-process active' : 'cycle-process'} d={d} />
        </g>
      })}
      {data.refrigerant.states.map((point) => {
        const process = cycle.find((item) => item.from === point.id)!
        return <g key={point.id} className={selectedProcess === process.id ? 'point active' : 'point'} onClick={() => selectProcess(process.id, processComponentMap[process.id])} role="button" tabIndex={0} data-testid={`ph-${process.id}`}>
          <circle cx={x(point.enthalpyKJkg)} cy={y(point.pressureMPa)} r="6" />
          <text x={x(point.enthalpyKJkg)+8} y={y(point.pressureMPa)-6}>{point.id}</text>
          <title>{`点 ${point.id}: ${point.pressureMPa.toFixed(3)} MPa, ${point.temperatureC.toFixed(1)} °C, ${point.enthalpyKJkg.toFixed(1)} kJ/kg${point.quality === null ? '' : `, x=${point.quality.toFixed(3)}`}`}</title>
        </g>
      })}
      <text x="122" y="187" className="axis-title">比焓 h / kJ·kg⁻¹</text>
    </svg>
  </section>
}
