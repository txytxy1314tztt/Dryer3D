import type { DryerType } from '../models/catalog'

export type ComparisonRow = {
  label: string
  values: Record<DryerType, string>
  engineering?: Record<DryerType, string>
}

export const comparisonRows: ComparisonRow[] = [
  { label: '结构 Structure', values: { vented: '开式空气通路', condenser: '闭式过程空气 + 独立冷却空气', 'heat-pump': '闭式过程空气 + 制冷剂回路' } },
  { label: '热源 Heat source', values: { vented: '电加热器', condenser: '电加热器', 'heat-pump': '冷凝器回收并提升热量' }, engineering: { vented: '电阻热直接输入过程空气。', condenser: '电阻热输入过程空气，空气换热器负责除湿。', 'heat-pump': '压缩机输入功驱动蒸气压缩循环；冷凝热包含蒸发吸热与压缩功。' } },
  { label: '空气流路 Air path', values: { vented: '环境进气后排至室外', condenser: '过程空气循环', 'heat-pump': '过程空气循环' } },
  { label: '水分去向 Moisture', values: { vented: '水蒸气随排风离开', condenser: '换热器凝露进入水箱/排水', 'heat-pump': '蒸发器凝露进入水箱/排水' } },
  { label: '主要能量损失 Losses', values: { vented: '排风携带显热与潜热', condenser: '机壳散热与冷却空气带走热量', 'heat-pump': '机壳散热、压缩机及风机损失' }, engineering: { vented: '建筑补风负荷取决于安装环境，不能由本模型定量推断。', condenser: '冷却空气与过程空气隔壁换热，不直接混合。', 'heat-pump': '当前循环 COP 不含风机、电机、控制器和漏热。' } },
  { label: '温度特征 Temperature', values: { vented: '通常采用较高温热风', condenser: '电加热与冷凝除湿配合', 'heat-pump': '通常以较温和循环空气运行' } },
  { label: '衣物护理 Fabric care', values: { vented: '取决于程序和温控', condenser: '取决于程序和温控', 'heat-pump': '较温和温度有利于热敏织物护理' } },
  { label: '安装 Installation', values: { vented: '需要合规室外排风', condenser: '通常无需室外排风，需处理冷凝水', 'heat-pump': '通常无需室外排风，需处理冷凝水' } },
  { label: '成本 Cost boundary', values: { vented: '结构相对直接', condenser: '增加空气换热器和冷凝水系统', 'heat-pump': '增加完整制冷系统' }, engineering: { vented: '不提供无来源的购置价或能耗排序。', condenser: '地区、容量和产品定位会改变成本。', 'heat-pump': '复杂度增加不等同任何特定市场价格。' } },
  { label: '维护 Maintenance', values: { vented: '清洁绒毛过滤器和排风管', condenser: '清洁过滤器、空气换热器及水路', 'heat-pump': '清洁过滤器、换热器和冷凝水路径' } },
]

export const comparisonSourceNote = '原理边界依据 ENERGY STAR 与 DOE/ORNL；具体布局、温度、成本和维护周期因产品而异。'
