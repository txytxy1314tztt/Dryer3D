import { machineCatalog } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'

export function Header() {
  const machine = useTeachingStore((state) => state.machine)
  const setMachine = useTeachingStore((state) => state.setMachine)
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">HP</span>
        <div>
          <strong>热泵干衣机 3D 工程教学平台</strong>
          <span>Heat Pump Dryer Engineering Lab</span>
        </div>
      </div>
      <nav className="machine-tabs" aria-label="三种干衣机入口">
        {machineCatalog.map((item) => (
          <button
            key={item.id}
            className={machine === item.id ? 'active' : ''}
            onClick={() => setMachine(item.id)}
            data-testid={`machine-${item.id}`}
          >
            <span>{item.label}</span>
            <small>{item.english}</small>
          </button>
        ))}
      </nav>
      <div className="stage-tag"><span>STAGE 01</span>可运行骨架</div>
    </header>
  )
}
