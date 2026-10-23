import { getMachine } from '../models/catalog'
import { componentDefinitions, componentLabel } from '../models/engineering'
import { useTeachingStore } from '../state/teachingStore'
import { useThermoData } from '../thermo/useThermoData'
import { EnergyFlow } from './EnergyFlow'
import { processExplanations } from '../content/explanations'

const processLabels: Record<string, string> = {
  '1-2': '压缩 Compression',
  '2-3': '冷凝放热 Condensation',
  '3-4': '节流 Expansion',
  '4-1': '蒸发吸热 Evaporation',
  heating: '空气加热 Air heating',
  humidifying: '滚筒吸湿 Moisture pickup',
  dehumidifying: '冷却除湿 Cooling & dehumidification',
}

export function ParameterPanel() {
  const state = useTeachingStore()
  const machine = getMachine(state.machine)
  const { data, error } = useThermoData()
  const selected = state.selectedComponent && state.selectedComponent in componentDefinitions
    ? componentDefinitions[state.selectedComponent as keyof typeof componentDefinitions]
    : null
  const explanation = state.selectedProcess ? processExplanations[state.selectedProcess] : null
  return (
    <aside className="parameter-panel">
      <div className="panel-heading"><span className="eyebrow">ENGINEERING CONTEXT</span><h3>参数与边界</h3></div>
      <section className="summary-block">
        <span className="summary-accent" style={{ background: machine.accent }} />
        <h4>{machine.label} <small>{machine.english}</small></h4>
        <p>{machine.shortDescription}</p>
      </section>
      <dl className="spec-list">
        <div><dt>空气路径</dt><dd>{machine.airPath}</dd></div>
        <div><dt>水分去向</dt><dd>{machine.moistureDestination}</dd></div>
        <div><dt>当前部件</dt><dd data-testid="selected-component">{componentLabel(state.selectedComponent)}</dd></div>
        <div><dt>当前过程</dt><dd data-testid="selected-process">{state.selectedProcess ? processLabels[state.selectedProcess] : '未选择'}</dd></div>
      </dl>
      {selected && <section className="component-note"><strong>{selected.label}</strong><p>{selected.note}</p></section>}
      {error && <div className="data-error">{error}</div>}
      {machine.id === 'heat-pump' && data && <>
        <div className="state-table" data-testid="refrigerant-states">
          <div className="state-head"><span>点</span><span>MPa</span><span>°C</span><span>kJ/kg</span><span>相态/x</span></div>
          {data.refrigerant.states.map((point) => <button key={point.id} className={state.selectedProcess === data.refrigerant.processes.find((p) => p.from === point.id)?.id ? 'active' : ''} onClick={() => {
            const process = data.refrigerant.processes.find((p) => p.from === point.id)!
            state.selectProcess(process.id, process.component)
          }}>
            <strong>{point.id}</strong><span>{point.pressureMPa.toFixed(3)}</span><span>{point.temperatureC.toFixed(1)}</span><span>{point.enthalpyKJkg.toFixed(1)}</span><span>{point.quality === null ? (point.phase === 'gas' ? '气相' : '液相') : `两相/${point.quality.toFixed(3)}`}</span>
          </button>)}
        </div>
        <div className="humid-state-grid" data-testid="humid-air-states">
          {data.humidAir.states.map((point) => <div key={point.id}><strong>{point.id}</strong><span>{point.dryBulbC.toFixed(0)} °C</span><span>RH {(point.relativeHumidity*100).toFixed(1)}%</span><span>W {(point.humidityRatioKgKgDryAir*1000).toFixed(2)} g/kg</span><span>h {point.enthalpyKJkgDryAir.toFixed(1)} kJ/kg</span></div>)}
        </div>
        <EnergyFlow />
        <details className="assumption-details"><summary>工况假设与适用范围</summary><p>R134a：蒸发 5 °C、冷凝 50 °C、过热 8 K、过冷 5 K、压缩机等熵效率 0.70；忽略换热器压降，节流近似等焓。</p><p>湿空气：101.325 kPa；A/B/C 为蒸发器出口、冷凝器出口、滚筒出口的离散教学点。不是衣物动态干燥模型。</p></details>
        <p className="data-provenance">CoolProp {data.library.version} · 算法 {data.algorithmVersion} · 静态教学工况</p>
      </>}
      <section className="depth-copy">
        <h4>{state.depth === 'basic' ? '基础讲解' : '工程深入'}</h4>
        <p data-testid="depth-explanation">{explanation ? explanation[state.depth] : state.depth === 'basic' ? '先识别部件、流向和换热方向。' : '查看状态点、相区、露点、单位质量能量平衡与计算边界。'}</p>
      </section>
    </aside>
  )
}
