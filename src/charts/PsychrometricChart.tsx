import { processComponentMap, useTeachingStore } from '../state/teachingStore'
import { useThermoData } from '../thermo/useThermoData'

const b = { left: 42, right: 324, top: 20, bottom: 158 }
const x = (t: number) => b.left + ((t - 5) / 55) * (b.right - b.left)
const y = (w: number) => b.bottom - (w / 40) * (b.bottom - b.top)
const curve = (points: { dryBulbC: number; humidityRatioGkg: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.dryBulbC).toFixed(1)} ${y(p.humidityRatioGkg).toFixed(1)}`).join(' ')

export function PsychrometricChart() {
  const { data, error } = useThermoData()
  const selectedProcess = useTeachingStore((state) => state.selectedProcess)
  const selectProcess = useTeachingStore((state) => state.selectProcess)
  if (error) return <section className="chart-card chart-error">{error}</section>
  if (!data) return <section className="chart-card chart-loading">正在加载湿空气数据…</section>
  const states = Object.fromEntries(data.humidAir.states.map((item) => [item.id, item]))
  return <section className="chart-card" aria-labelledby="psych-title">
    <div className="chart-title-row">
      <div><span className="eyebrow">101.325 kPa · HUMID AIR</span><h3 id="psych-title">焓湿图 <small>Psychrometric chart</small></h3></div>
      <span className="placeholder-badge verified">离散教学工况</span>
    </div>
    <svg viewBox="0 0 340 190" role="img" aria-label="由 CoolProp 湿空气函数生成的焓湿图">
      <path className="axis" d={`M${b.left} ${b.top}V${b.bottom}H${b.right}`} />
      {data.humidAir.chart.rhCurves.map((item) => <path key={item.relativeHumidityPercent} className={item.relativeHumidityPercent === 100 ? 'saturation-line' : 'psych-grid'} d={curve(item.points.filter((p) => p.humidityRatioGkg <= 40))} />)}
      {data.humidAir.chart.enthalpyLines.map((item) => <path key={item.enthalpyKJkgDryAir} className="enthalpy-line" d={curve(item.points.filter((p) => p.humidityRatioGkg <= 40))}><title>{`${item.enthalpyKJkgDryAir} kJ/kg 干空气`}</title></path>)}
      {[10,20,30,40,50,60].map((t) => <text key={t} x={x(t)-6} y="173">{t}</text>)}
      {[10,20,30,40].map((w) => <text key={w} x="17" y={y(w)+3}>{w}</text>)}
      {data.humidAir.processes.map((process) => {
        const from = states[process.from]
        const to = states[process.to]
        const d = `M${x(from.dryBulbC)} ${y(from.humidityRatioKgKgDryAir*1000)}L${x(to.dryBulbC)} ${y(to.humidityRatioKgKgDryAir*1000)}`
        return <g key={process.id} onClick={() => selectProcess(process.id, processComponentMap[process.id])}>
          <path data-testid={`psych-${process.id}`} className="chart-hit" d={d} />
          <path className={selectedProcess === process.id ? 'psych-process active' : 'psych-process'} d={d} />
        </g>
      })}
      {data.humidAir.states.map((point) => {
        const process = data.humidAir.processes.find((item) => item.from === point.id)!
        return <g key={point.id} className={selectedProcess === process.id ? 'point active' : 'point'} data-testid={`psych-point-${process.id}`} onClick={() => selectProcess(process.id, process.component)} role="button" tabIndex={0}><circle cx={x(point.dryBulbC)} cy={y(point.humidityRatioKgKgDryAir*1000)} r="6" /><text x={x(point.dryBulbC)+7} y={y(point.humidityRatioKgKgDryAir*1000)-6}>{point.id}</text><title>{`${point.dryBulbC} °C, RH ${(point.relativeHumidity*100).toFixed(1)}%, W ${(point.humidityRatioKgKgDryAir*1000).toFixed(2)} g/kg, h ${point.enthalpyKJkgDryAir.toFixed(1)} kJ/kg`}</title></g>
      })}
      <text x="119" y="187" className="axis-title">干球温度 Tdb / °C</text><text x="4" y="14">W / g·kg⁻¹</text>
    </svg>
  </section>
}
