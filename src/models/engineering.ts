import type { DryerType } from './catalog'

export type ComponentId =
  | 'cabinet' | 'drum' | 'fan' | 'lint-filter' | 'heater' | 'exhaust'
  | 'air-condenser' | 'cooling-fan' | 'water-tray' | 'drain'
  | 'compressor' | 'condenser' | 'capillary' | 'evaporator'

export type ComponentDefinition = {
  id: ComponentId
  label: string
  english: string
  process?: string
  note: string
}

export const componentDefinitions: Record<ComponentId, ComponentDefinition> = {
  cabinet: { id: 'cabinet', label: '机壳', english: 'Cabinet', note: '教学剖面外壳；不对应具体商品尺寸。' },
  drum: { id: 'drum', label: '滚筒', english: 'Drum', process: 'humidifying', note: '衣物在滚筒内与过程空气接触并释放水分。' },
  fan: { id: 'fan', label: '循环风机', english: 'Process fan', note: '风机位置随产品布局而异，此处为流路示意。' },
  'lint-filter': { id: 'lint-filter', label: '绒毛过滤器', english: 'Lint filter', note: '拦截绒毛，保护风道和换热器。' },
  heater: { id: 'heater', label: '电加热器', english: 'Electric heater', process: 'heating', note: '直排式/空气冷凝式的过程空气热源。' },
  exhaust: { id: 'exhaust', label: '排风管', english: 'Exhaust duct', note: '直排式湿空气排至室外。' },
  'air-condenser': { id: 'air-condenser', label: '空气冷凝换热器', english: 'Air-to-air condenser', process: 'dehumidifying', note: '过程空气与环境冷却空气隔壁换热，不直接混合。' },
  'cooling-fan': { id: 'cooling-fan', label: '冷却风机', english: 'Cooling-air fan', note: '驱动独立环境冷却空气流。' },
  'water-tray': { id: 'water-tray', label: '冷凝水盘', english: 'Condensate tray', note: '收集换热器表面凝露。' },
  drain: { id: 'drain', label: '排水路径', english: 'Drain path', note: '通向水箱或外接排水；具体方案因产品而异。' },
  compressor: { id: 'compressor', label: '压缩机', english: 'Compressor', process: '1-2', note: '低压蒸气压缩为高压过热蒸气。' },
  condenser: { id: 'condenser', label: '冷凝器', english: 'Condenser', process: '2-3', note: '冷媒向过程空气放热，两流体不直接混合。' },
  capillary: { id: 'capillary', label: '毛细管', english: 'Capillary tube', process: '3-4', note: '本教学机型采用毛细管作为节流元件。' },
  evaporator: { id: 'evaporator', label: '蒸发器', english: 'Evaporator', process: '4-1', note: '湿空气向冷媒放热并冷却到露点以下形成凝露。' },
}

export const machineComponents: Record<DryerType, ComponentId[]> = {
  vented: ['cabinet', 'drum', 'lint-filter', 'heater', 'fan', 'exhaust'],
  condenser: ['cabinet', 'drum', 'lint-filter', 'heater', 'fan', 'air-condenser', 'cooling-fan', 'water-tray', 'drain'],
  'heat-pump': ['cabinet', 'drum', 'lint-filter', 'fan', 'compressor', 'condenser', 'capillary', 'evaporator', 'water-tray', 'drain'],
}

export const refrigerantTopology: ComponentId[] = [
  'compressor', 'condenser', 'capillary', 'evaporator', 'compressor',
]

export const airTopologies: Record<DryerType, string[]> = {
  vented: ['ambient-inlet', 'heater', 'drum', 'lint-filter', 'fan', 'outdoor-exhaust'],
  condenser: ['heater', 'drum', 'lint-filter', 'fan', 'air-condenser', 'heater'],
  'heat-pump': ['condenser', 'drum', 'lint-filter', 'evaporator', 'fan', 'condenser'],
}

export const componentLabel = (id: string | null) => {
  if (!id || !(id in componentDefinitions)) return '未选择'
  const item = componentDefinitions[id as ComponentId]
  return `${item.label} ${item.english}`
}
