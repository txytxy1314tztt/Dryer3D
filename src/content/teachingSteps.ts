import type { CircuitVisibility } from '../state/teachingStore'

export type TeachingStep = {
  title: string
  body: string
  process: string | null
  component: string | null
  circuit: CircuitVisibility
}

export const teachingSteps: TeachingStep[] = [
  {
    title: '循环总览',
    body: '同时观察闭式空气循环和蒸气压缩制冷循环。步骤只是讲解顺序，不表示部件依次启停。',
    process: null, component: null, circuit: 'both',
  },
  {
    title: '1→2 压缩',
    body: '压缩机提高冷媒压力、温度和比焓；其余部件在稳态下并非关闭。',
    process: '1-2', component: 'compressor', circuit: 'refrigerant',
  },
  {
    title: '2→3 冷凝',
    body: '高压冷媒向隔壁过程空气放热；局部视图强调两流体不直接混合。',
    process: '2-3', component: 'condenser', circuit: 'both',
  },
  {
    title: '3→4 节流',
    body: '毛细管近似等焓节流，高压过冷液体变为低压两相混合物。',
    process: '3-4', component: 'capillary', circuit: 'refrigerant',
  },
  {
    title: '4→1 蒸发',
    body: '低压冷媒从湿空气吸热并蒸发，出口保留设定过热度。',
    process: '4-1', component: 'evaporator', circuit: 'both',
  },
  {
    title: '空气加热 A→B',
    body: '空气通过冷凝器升温，教学工况近似保持含湿量不变。',
    process: 'heating', component: 'condenser', circuit: 'air',
  },
  {
    title: '滚筒吸湿 B→C',
    body: '空气温度下降、含湿量上升；计算结果不把该过程假定为严格等焓。',
    process: 'humidifying', component: 'drum', circuit: 'air',
  },
  {
    title: '冷却除湿 C→A',
    body: '蒸发器表面低于露点，空气降温除湿并形成冷凝水。',
    process: 'dehumidifying', component: 'evaporator', circuit: 'both',
  },
]
