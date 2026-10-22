# 待审批的资源与依赖候选

本清单已在 2026-10-22 通过官方文档与 npm registry 核验。阶段 1 选择结果如下。

## 核心前端依赖候选

| 候选 | 用途 | 预期许可证 | 初步集成判断 | 阶段 1 是否需要 |
|---|---|---|---|---|
| React + React DOM 19.3.1 | UI 与组件生命周期 | MIT | 与 R3F 9 配对 | 已采用 |
| TypeScript 7.0.2 | 类型安全和数据契约 | Apache-2.0 | Node 24 下构建通过 | 已采用 |
| Vite 8.3.5 + React 插件 6.1.2 | 开发服务器与生产构建 | MIT | Node 24 满足官方引擎范围 | 已采用 |
| Three.js 0.186.1 | WebGL 3D 内核 | MIT | 程序化几何适合阶段骨架 | 已采用 |
| React Three Fiber 9.8.2 | React 与 Three.js 集成 | MIT | 官方说明 R3F 9 配 React 19 | 已采用 |
| Drei 10.7.9 | OrbitControls 等辅助 | MIT | 仅使用必要模块；移除了有竞态的 Html 标签 | 已采用 |
| Zustand 5.0.15 | 统一教学状态 | MIT | 采用已发布约两个月的补丁版，避免当天版本等待期例外 | 已采用 |
| Vitest 5.0.5 | 单元测试 | MIT | 与 Vite 8、Node 24 兼容 | 已采用 |
| Playwright Test 1.62.1 | Chrome E2E | Apache-2.0 | 使用系统 Chrome，避免额外浏览器下载 | 已采用 |

图表阶段暂不引入 Recharts 或 ECharts。P-h 图和焓湿图需要物理坐标、相区和自定义联动，阶段 3 再比较 D3、自定义 SVG/Canvas 与开源图表库，避免阶段 1 提前增加依赖。

## GitHub 实现参考候选

| 候选仓库 | 参考范围 | 复用策略 | 待核验 |
|---|---|---|---|
| `mrdoob/three.js` | 场景、材质、剖切和性能示例 | 只参考官方示例与 API，不复制不明来源资产 | 许可证、最新发布、维护状态 |
| `pmndrs/react-three-fiber` | R3F 架构与事件 | 以官方文档为实现依据 | 兼容 React/Three 版本矩阵 |
| `pmndrs/drei` | 相机控制、标签与辅助组件 | 只选实际需要的模块 | 依赖体积与版本兼容性 |
| `vitest-dev/vitest` | Vite 单测配置 | 使用官方模板和文档 | Node 24 支持范围 |
| `microsoft/playwright` | E2E 与浏览器项目配置 | 使用官方测试 API | 系统 Chrome/Edge 通道兼容性 |
| `CoolProp/CoolProp` | 阶段 3 物性计算 | 使用官方 Python API 和引用信息 | 版本、许可证、R134a/湿空气适用范围 |

## 3D 资产策略

阶段 1 不下载外部 3D 模型。阶段 2 优先使用程序化几何创建教学示意结构，原因如下：

- 能明确控制冷媒和空气拓扑，不受外观模型内部结构错误影响。
- 不引入来源不明的厂商 CAD、拆机图或尺寸。
- 资产许可证和署名负担最低。

备选资产库只在阶段 2 前另行审批：Khronos glTF 示例资产可用于加载器测试，但每个模型许可证可能不同；Sketchfab 等平台不能按平台整体视为可复用，必须逐资产核验作者、许可证、署名和再分发条件。

## HeyGen / HyperFrames 评估

- 当前本地存在的 HyperFrames Skill 描述的是 HTML 视频合成、动画、字幕、配音和视频渲染流程。
- 本地证据没有表明它能输出可在浏览器中自由旋转、部件选择、剖切并与物性图表双向联动的工程 3D 资产。
- “HeyGen HyperFrames”是否是同一产品、收费方式、输出格式和许可证均无法在不访问外部资料的前提下确认。
- 初步决策：不作为依赖，不影响 React + R3F 方案。若用户要求，可在获准联网后单独核实，但不会把视频输出当成交互式 3D。

## 阶段 1 执行结果

- 只安装上述项目级依赖并生成 `pnpm-lock.yaml`，未全局安装任何工具。
- `pnpm audit --prod` 返回 `No known vulnerabilities found`。
- 未下载第三方 3D 模型，未安装 Blender、CoolProp 或新 Skills。
- npm 元数据显示核心包均在 2026-09-24 至 2026-10-22 之间有发布更新；具体时间记录在 `docs/SOURCES.md`。

