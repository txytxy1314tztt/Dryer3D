import { comparisonRows, comparisonSourceNote } from '../content/comparison'
import { machineCatalog } from '../models/catalog'
import { useTeachingStore } from '../state/teachingStore'

export type InfoPanel = 'comparison' | 'references' | null

const references = [
  ['CoolProp R134a', 'https://coolprop.org/fluid_properties/fluids/R134a.html'],
  ['CoolProp Humid Air', 'https://coolprop.org/fluid_properties/HumidAir.html'],
  ['CoolProp High-Level API', 'https://coolprop.org/coolprop/HighLevelAPI.html'],
  ['ENERGY STAR Clothes Dryers', 'https://www.energystar.gov/products/clothes_dryers'],
  ['DOE/ORNL Heat Pump Clothes Dryer', 'https://www.energy.gov/sites/default/files/2017/04/f34/6_32226b_Gluesenkamp_031317-1630.pdf'],
  ['Three.js', 'https://github.com/mrdoob/three.js'],
  ['React Three Fiber', 'https://github.com/pmndrs/react-three-fiber'],
]

export function KnowledgeDrawer({ panel, onClose }: { panel: InfoPanel; onClose: () => void }) {
  const depth = useTeachingStore((s) => s.depth)
  if (!panel) return null
  return <div className="drawer-backdrop" onMouseDown={onClose}>
    <section className="knowledge-drawer" onMouseDown={(e) => e.stopPropagation()} aria-label={panel === 'comparison' ? '三机型工程对比' : '参考资料与版权'}>
      <div className="drawer-title"><div><span className="eyebrow">STAGE 04 KNOWLEDGE BASE</span><h2>{panel === 'comparison' ? '三机型工程对比' : '参考资料与版权'}</h2></div><button onClick={onClose}>关闭 ×</button></div>
      {panel === 'comparison' ? <>
        <div className="comparison-table" data-testid="comparison-table">
          <div className="comparison-row comparison-head"><strong>维度</strong>{machineCatalog.map((m) => <strong key={m.id}>{m.label}<small>{m.english}</small></strong>)}</div>
          {comparisonRows.map((row) => <div className="comparison-row" key={row.label}><strong>{row.label}</strong>{machineCatalog.map((m) => <div key={m.id}><span>{row.values[m.id]}</span>{depth === 'engineering' && row.engineering?.[m.id] && <small>{row.engineering[m.id]}</small>}</div>)}</div>)}
        </div><p className="source-note">{comparisonSourceNote}</p>
      </> : <div className="references-view" data-testid="references-view">
        <p>原理依据优先采用官方资料；实现依赖和资产许可证均在仓库文档中登记。链接访问日期见 <code>docs/SOURCES.md</code>。</p>
        <ul>{references.map(([label,url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>
        <h3>版权与资产声明</h3>
        <p>三机型、管路、图表、标签和 UI 均由项目代码程序化生成。未打包 PPT 厂商图片、外部 3D 模型、网络字体、付费素材或闭源 API。</p>
        <p>运行时依赖主要为 MIT；TypeScript 与 Playwright 为 Apache-2.0；CoolProp 为 MIT，NumPy 为 BSD-3-Clause。完整版本见锁文件与 <code>docs/THIRD_PARTY_NOTICES.md</code>。</p>
        <p className="warning-copy">教学平台不是实机标定仿真器，不能用于制造、公差、认证或能效等级判定。</p>
      </div>}
    </section>
  </div>
}
