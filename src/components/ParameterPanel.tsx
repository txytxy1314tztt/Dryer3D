import { getMachine } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'

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
        <div><dt>当前部件</dt><dd data-testid="selected-component">{state.selectedComponent ?? '未选择'}</dd></div>
        <div><dt>当前过程</dt><dd data-testid="selected-process">{state.selectedProcess ? processLabels[state.selectedProcess] : '未选择'}</dd></div>
      </dl>
      <div className="placeholder-data">
        <div><span>压力 Pressure</span><strong>— <small>MPa</small></strong></div>
        <div><span>温度 Temperature</span><strong>— <small>°C</small></strong></div>
        <div><span>比焓 Enthalpy</span><strong>— <small>kJ/kg</small></strong></div>
        <p>阶段 1 不生成或展示虚构物性数值。</p>
      </div>
      <section className="depth-copy">
        <h4>{state.depth === 'basic' ? '基础讲解' : '工程深入'}</h4>
        <p>{state.depth === 'basic' ? '先识别部件、流向和换热方向。' : '阶段 3 将展开状态方程、假设、相区、能量平衡与引用。'}</p>
      </section>
    </aside>
  )
}
