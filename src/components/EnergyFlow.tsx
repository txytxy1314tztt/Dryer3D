import { useTeachingStore } from '../state/teachingStore'
import { useThermoData } from '../thermo/useThermoData'

export function EnergyFlow() {
  const { data } = useThermoData()
  const selected = useTeachingStore((s) => s.selectedProcess)
  const select = useTeachingStore((s) => s.selectProcess)
  if (!data) return null
  const e = data.refrigerant.energyPerKg
  return <section className="energy-flow">
    <div className="panel-heading"><span className="eyebrow">UNIT-MASS ENERGY BALANCE</span><h3>能量流 <small>Energy flow</small></h3></div>
    <div className="energy-equation">q<sub>cond</sub> ≈ q<sub>evap</sub> + w<sub>comp</sub></div>
    <button data-testid="energy-evaporator" className={selected === '4-1' ? 'active' : ''} onClick={() => select('4-1', 'evaporator')}><span>蒸发吸热</span><strong>{e.evaporatorHeatKJkg.toFixed(1)}</strong><small>kJ/kg</small></button>
    <span className="energy-plus">+</span>
    <button data-testid="energy-compressor" className={selected === '1-2' ? 'active' : ''} onClick={() => select('1-2', 'compressor')}><span>压缩功</span><strong>{e.compressorWorkKJkg.toFixed(1)}</strong><small>kJ/kg</small></button>
    <span className="energy-equals">=</span>
    <button data-testid="energy-condenser" className={selected === '2-3' ? 'active' : ''} onClick={() => select('2-3', 'condenser')}><span>冷凝放热</span><strong>{e.condenserHeatKJkg.toFixed(1)}</strong><small>kJ/kg</small></button>
    <p>供热 COP<sub>cycle</sub> = {e.heatingCOP.toFixed(2)}。仅为理想化制冷循环，不是实测整机 COP 或能效等级。</p>
  </section>
}
