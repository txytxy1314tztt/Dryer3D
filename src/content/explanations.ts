export const processExplanations: Record<string, { basic: string; engineering: string }> = {
  '1-2': { basic: '压缩机让低压冷媒蒸气升压升温。', engineering: '以 ηis=0.70 从等熵参考出口修正实际焓升：h₂=h₁+(h₂s−h₁)/ηis。' },
  '2-3': { basic: '高温冷媒隔着金属壁把热量交给空气。', engineering: '高压侧冷媒去过热、冷凝并过冷；单位质量放热 qcond=h₂−h₃。' },
  '3-4': { basic: '毛细管降压，让液态冷媒部分闪蒸。', engineering: '稳流节流近似 h₃=h₄；本工况状态 4 干度 x=0.29344。' },
  '4-1': { basic: '低温冷媒从湿空气吸热并蒸发。', engineering: '单位质量吸热 qevap=h₁−h₄；出口设置 8 K 过热度。' },
  heating: { basic: '空气经过冷凝器升温，含湿量基本不变。', engineering: 'A→B 固定 W=0.0125019 kg/kg 干空气，由 20 °C 加热至 50 °C。' },
  humidifying: { basic: '热空气经过衣物后降温并带走水分。', engineering: 'B→C 的 W 与 h 均增加；离散工况不假定严格等焓或等温。' },
  dehumidifying: { basic: '湿空气冷到露点以下，水蒸气形成冷凝水。', engineering: '蒸发器表面示意 10 °C 低于 C 点露点 26.07 °C，满足凝露必要条件。' },
}
