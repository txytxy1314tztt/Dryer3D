import { teachingSteps } from '../content/teachingSteps'
import { useTeachingStore } from '../state/teachingStore'

export function ControlRail() {
  const state = useTeachingStore()
  return (
    <aside className="control-rail">
      <section>
        <span className="section-number">01</span>
        <h3>学习模式</h3>
        <div className="segmented">
          <button className={state.mode === 'guided' ? 'active' : ''} onClick={() => state.setMode('guided')}>引导教学</button>
          <button className={state.mode === 'explore' ? 'active' : ''} onClick={() => state.setMode('explore')}>自由探索</button>
        </div>
        <div className="segmented compact">
          <button className={state.depth === 'basic' ? 'active' : ''} onClick={() => state.setDepth('basic')}>基础讲解</button>
          <button className={state.depth === 'engineering' ? 'active' : ''} onClick={() => state.setDepth('engineering')}>工程深入</button>
        </div>
      </section>

      <section>
        <span className="section-number">02</span>
        <h3>教学步骤</h3>
        <ol className="step-list">
          {teachingSteps.map((item, index) => (
            <li key={item.title} className={state.step === index ? 'active' : ''}>
              <button onClick={() => state.setStep(index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><small>{item.body}</small></div>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="boundary-note">
        <span className="section-number">!</span>
        <div><strong>模型边界</strong><p>播放进度仅用于教学动画，不代表真实烘干时间或实测数据。</p></div>
      </section>
    </aside>
  )
}
