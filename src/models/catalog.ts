export type DryerType = 'vented' | 'condenser' | 'heat-pump'

export type MachineDefinition = {
  id: DryerType
  label: string
  english: string
  shortDescription: string
  accent: string
  airPath: string
  moistureDestination: string
}

export const machineCatalog: MachineDefinition[] = [
  {
    id: 'vented',
    label: '直排式',
    english: 'Vented dryer',
    shortDescription: '环境空气经电加热后穿过滚筒，湿空气通过排风管排出。',
    accent: '#ff9f43',
    airPath: '环境进气 → 加热 → 滚筒 → 室外排风',
    moistureDestination: '水蒸气随排风离开设备',
  },
  {
    id: 'condenser',
    label: '空气冷凝式',
    english: 'Condenser dryer',
    shortDescription: '过程空气循环，湿空气在空气换热器中冷却并形成冷凝水。',
    accent: '#55c2ff',
    airPath: '加热 → 滚筒 → 空气冷凝换热器 → 再加热',
    moistureDestination: '冷凝水进入水箱或排水管',
  },
  {
    id: 'heat-pump',
    label: '热泵式',
    english: 'Heat pump dryer',
    shortDescription: '闭式空气循环与蒸气压缩制冷循环通过换热器间接耦合。',
    accent: '#58e0b6',
    airPath: '冷凝器加热 → 滚筒吸湿 → 蒸发器除湿 → 冷凝器',
    moistureDestination: '蒸发器表面凝露后排入水箱或排水管',
  },
]

export const getMachine = (type: DryerType) =>
  machineCatalog.find((machine) => machine.id === type) ?? machineCatalog[2]
