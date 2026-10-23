import { useTeachingStore, type CircuitVisibility, type ViewMode } from '../state/teachingStore'

export function TransportBar() {
  const state = useTeachingStore()
  return (
    <div className="transport-bar">
      <button className="play-button" onClick={state.togglePlaying} aria-label={state.playing ? '暂停' : '播放'}>
        {state.playing ? 'Ⅱ' : '▶'}
      </button>
      <div className="progress-readout">
        <span>教学动画相位</span>
        <div className="progress-track"><i style={{ width: `${state.teachingProgress * 100}%` }} /></div>
      </div>
      <label>倍速
        <select value={state.speed} onChange={(event) => state.setSpeed(Number(event.target.value) as 0.5 | 1 | 2)}>
          <option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option>
        </select>
      </label>
      <label>循环
        <select value={state.circuit} onChange={(event) => state.setCircuit(event.target.value as CircuitVisibility)}>
          <option value="both">双循环</option><option value="air">仅空气</option><option value="refrigerant">仅冷媒</option>
        </select>
      </label>
      <label>视角
        <select value={state.viewMode} onChange={(event) => state.setViewMode(event.target.value as ViewMode)}>
          <option value="exterior">工程整机</option><option value="transparent">透明</option><option value="section">剖切示意</option><option value="internal">内部工作</option><option value="exploded">爆炸教学</option>
        </select>
      </label>
      <button className="text-button" onClick={state.reset}>重置</button>
    </div>
  )
}
