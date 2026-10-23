# 阶段 4 最终测试报告

执行日期：2026-10-23（Asia/Shanghai）  
平台：Windows 11，Node.js 24.18.0，pnpm 11.25.0，Python 3.11.15  
浏览器：Google Chrome 155.0.8059.85；Microsoft Edge 155.0.4283.62

## 结论

阶段 4 本地发布候选版通过 TypeScript、生产构建、14 项前端单元测试、7 项物理测试和 Chrome/Edge 共 8 项端到端测试。自动化浏览器未捕获失败请求、页面异常或 `console.error`。低端独立硬件、长时稳定性、专业 GPU 帧时间、Safari/Firefox/移动端未验证，不能据此声称所有设备恒定 60 FPS。

## 测试矩阵

| 范围 | 状态 | 实际命令/方法 | 证据 |
|---|---|---|---|
| TypeScript | 通过 | `pnpm exec tsc -b` | 退出码 0，无诊断 |
| 生产构建 | 通过（有警告） | `pnpm build` | 589 modules；主包 255.70 kB/gzip 81.39 kB；场景 944.13 kB/gzip 251.34 kB；保留 >500 kB 警告 |
| 前端单元测试 | 通过 | `pnpm test` | 4 文件，14/14；含拓扑、同步、物性 JSON 和画质策略 |
| 热力学一致性 | 通过 | `pnpm physics:test` | Python unittest 7/7；高低压、等焓、能量闭合、两相区、湿空气与凝露 |
| Chrome E2E | 通过 | `pnpm test:e2e` 的 `chrome` project | 阶段 1–4 共 4/4 |
| Edge E2E | 通过 | `pnpm test:e2e` 的 `edge` project | 阶段 1–4 共 4/4 |
| 三机型/工作台回归 | 通过 | 阶段 1/2/3 E2E | 入口、结构模式、图表联动和时间线可操作 |
| 三机型对比 | 通过 | 阶段 4 E2E | 打开对比抽屉；基础行与工程深入扩展可见 |
| 参考资料/版权 | 通过 | 阶段 4 E2E | 资料抽屉、来源与版权边界可访问 |
| localStorage | 通过 | 阶段 4 E2E | 白名单跨刷新恢复；无令牌、用户内容或物性伪数据字段 |
| 设置重置 | 通过 | 阶段 4 E2E | 恢复默认机型、层级、画质和步骤 |
| 3D 全屏 | 通过 | 阶段 2/4 E2E | 进入/退出；布局及统一状态保留 |
| 物性资源加载 | 通过 | HTTP request + 浏览器监听 | `/data/stage3-thermodynamics.json` 返回 200，schema 与检查字段正确 |
| 控制台/页面异常 | 通过 | `console`、`pageerror` 监听 | Chrome/Edge `runtimeErrors: []` |
| 失败请求 | 通过 | `requestfailed` 监听 | Chrome/Edge `failedRequests: []` |
| WebGL | 通过 | 浏览器运行时探测 | 两浏览器均为 WebGL 2.0，Canvas 数量 1 |
| 本机性能观察 | 通过（观察） | Navigation/DOM/rAF/heap 采样 | 见下表；不是 GPU profiler 或跨硬件承诺 |
| 低画质回退逻辑 | 通过 | Vitest | 减少动态、低硬件和高硬件三类决策用例 |
| 低端实体机 | 未验证 | 无目标设备 | 需在指定 CPU/GPU/内存设备复测 |
| 长时稳定性/显存峰值 | 未验证 | 未执行 soak/GPU profiler | 非本阶段自动化证据范围 |
| Safari/Firefox/移动端 | 未验证 | 未执行 | 用户要求的 Windows Chrome/Edge 已覆盖 |
| 公开部署 | 未验证/未执行 | 无 | 按要求等待平台选择与明确授权 |

## 浏览器观察指标

测试页为本机生产预览；数值受浏览器缓存、显示刷新率、后台调度和测试机影响。

| 项目 | Chrome | Edge |
|---|---:|---:|
| load event | 75.8 ms | 66.6 ms |
| DOM 节点 | 415 | 415 |
| Performance API 资源项 | 4 | 4 |
| 已报告 transferSize | 1,200 bytes | 1,200 bytes |
| 60 次 rAF 回调采样频率 | 88.76 Hz | 98.17 Hz |
| JS heap 单点观察 | 25,739,866 bytes | 28,805,939 bytes |
| WebGL | 2.0 | 2.0 |
| Canvas | 1 | 1 |

`rAF` 数值只说明回调在该次自动化运行中持续调度，不等同实际 GPU 渲染 FPS。`transferSize` 会受缓存和 Performance API 可见性影响，资源完整性以 HTTP 200、`requestfailed=[]` 和构建产物检查为准。

原始记录：`docs/STAGE4_BROWSER_METRICS-chrome.json`、`docs/STAGE4_BROWSER_METRICS-edge.json`。

## 物理一致性证据

- R134a 拓扑严格为压缩机 → 冷凝器 → 毛细管 → 蒸发器 → 压缩机。
- 低压 0.349659 MPa，高压 1.317905 MPa。
- `h3=h4=263.8967 kJ/kg`；状态 4 为两相，`x=0.29344`。
- `q_cond=186.0795≈q_evap 144.9042+w_comp 41.1753 kJ/kg`。
- 湿空气 A→B 含湿量保持，B→C 吸湿，C→A 冷却除湿；蒸发器表面 10 °C 低于 C 点露点 26.0728 °C。
- 所有数值都是固定教学工况，不是实测整机性能、真实功率或能效等级。

## 已知警告与风险

1. Vite 对 944.13 kB 的延迟 WebGL 场景块报告大于 500 kB。主 UI 与场景已拆分，且提供画质回退；进一步拆分 Three/Drei 依赖的收益有限，警告未被隐藏。
2. 自动画质使用浏览器暴露的启发式信息；`deviceMemory` 不存在时使用保守默认，不等于基准测试。
3. 场景模型无真实 CAD/拆机尺寸，因此不能用于制造、风阻、强度、噪声或公差判断。

## 失败尝试与复测

最终 `check-all.bat` 首次在受管沙箱内执行时，Chrome 访问本机预览被 `ERR_NETWORK_ACCESS_DENIED` 拒绝，Edge 还受到临时配置目录限制，8 个 E2E 因运行环境失败；同一次运行中的物理 7/7、Vitest 14/14 和构建均通过。随后在获准的沙箱外环境执行完全相同的 `pnpm test:e2e`，Chrome/Edge 8/8 通过（约 1.4 min）。因此该失败归类为测试环境限制，不归类为产品通过；最终产品结论以成功复测及原始指标 JSON 为证据。

## 截图证据

- `docs/screenshots/stage4-final-chrome.png`
- `docs/screenshots/stage4-final-edge.png`
- 阶段 2 多角度模型证据仍保存在 `docs/screenshots/stage2-*.png`。

