# 参考资料与来源登记

访问日期：2026-10-22（Asia/Shanghai）

## A 级：官方文档、权威机构与标准实现

| 来源 | 用途 | 适用条件与结论 |
|---|---|---|
| [CoolProp 8.0.0 文档](https://coolprop.org/contents.html) | 物性库范围、引用入口 | 阶段 3 使用前仍需在本机安装并记录实际库版本和 git revision |
| [CoolProp R134a](https://coolprop.org/fluid_properties/fluids/R134a.html) | R134a 状态方程依据 | 页面说明采用 R134a 国际标准状态方程；具体计算必须落在适用范围内 |
| [CoolProp Humid Air](https://coolprop.org/fluid_properties/HumidAir.html) | 湿空气定义、单位、适用范围 | 以干球温度、总压和水摩尔分数确定状态；含湿量按 kg 水/kg 干空气 |
| [CoolProp High-Level API](https://coolprop.org/coolprop/HighLevelAPI.html) | PropsSI、版本记录、SI 单位 | 阶段 3 JSON 必须记录 `__version__` 与 git revision，不手画物性曲线 |
| [ENERGY STAR Clothes Dryers](https://www.energystar.gov/products/clothes_dryers) | 三类边界与热泵闭式空气循环 | 作为原理与安装边界来源，不把项目教学 COP 等同认证指标 |
| [ENERGY STAR Heat Pump Dryer](https://www.energystar.gov/products/clothes_dryers/heat-pump-dryer) | 蒸发器除湿、冷凝水与无外排风 | 适用于典型无排风热泵式，具体产品结构仍可能不同 |
| [DOE ORNL Heat Pump Clothes Dryer](https://www.energy.gov/sites/default/files/2017/04/f34/6_32226b_Gluesenkamp_031317-1630.pdf) | 热泵干衣机循环和关键部件 | 官方研发演示资料，作为拓扑依据，不作为本项目实机尺寸或标定数据 |
| [Vite Getting Started](https://vite.dev/guide/) | Node 兼容性与标准命令 | Vite 8 要求 Node 20.19+ 或 22.12+；本机 Node 24.18 满足 |
| [React Three Fiber Installation](https://r3f.docs.pmnd.rs/getting-started/installation) | React/R3F 配对 | 官方说明 R3F 9 对应 React 19 |
| [Three.js MIT License](https://github.com/mrdoob/three.js/blob/dev/LICENSE) | 3D 内核许可证 | 复制或分发时保留版权与许可证文本 |
| [OpenAI Skills](https://developers.openai.com/plugins/concepts/skills) | Skills 能力边界 | Skill 提供可复用工作流说明，不替代项目依赖或工程资料 |

## B 级：可靠工程资料与实现参考

| 来源 | 用途 | 采用方式 |
|---|---|---|
| [CoolProp/CoolProp](https://github.com/CoolProp/CoolProp) | 阶段 3 Python API、测试与许可证 | 只使用正式发布版和官方接口，不复制未经审查示例数据 |
| [three.js](https://github.com/mrdoob/three.js) | WebGL、材质、剖切与性能实现参考 | 使用 API 与官方示例思想，不复制外部资产 |
| [react-three-fiber](https://github.com/pmndrs/react-three-fiber) | R3F 事件和组件结构 | 以官方文档为主，仓库用于版本和问题追踪 |
| [drei](https://github.com/pmndrs/drei) | OrbitControls 等辅助 | 按需导入；阶段 1 已因 React 19 DOM 门户竞态移除 `Html` 标签 |
| [Vitest](https://github.com/vitest-dev/vitest) | Vite 单元测试 | 采用官方运行器和配置 |
| [Playwright](https://github.com/microsoft/playwright) | 浏览器 E2E | 使用系统 Chrome 通道，不自动下载浏览器 |

## C 级：候选资产与未采用工具

| 候选 | 许可证/维护判断 | 决策 |
|---|---|---|
| [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) | 资产许可证并不统一，且可能含商标附加条件，必须逐项检查 | 阶段 1 不下载；未来只考虑加载器测试，不作为干衣机结构来源 |
| [HeyGen HyperFrames](https://hyperframes.app/docs/1-startup/1-introduction) | 开源 HTML 到确定性视频框架，可在 HTML 中使用 Three.js，但官方输出是 MP4 等固定视频 | 不适合本项目需要的可旋转、可选择、与图表联动的浏览器 3D 资产，因此不作为依赖 |
| 原 PPT 内 Panasonic/Gorenje 图片与水印图 | 未提供作者、网址、许可证或署名要求 | 仅用于内部审查，不进入网页或发布包 |

## npm 版本与维护快照

以下元数据来自 `pnpm view <package> version time.modified repository.url license`：

| 包 | 项目版本 | npm 最新版本 | npm 最近修改时间（UTC） | 许可证 |
|---|---:|---:|---|---|
| React / React DOM | 19.3.1 | 19.3.1 | 2026-10-21 | MIT |
| Vite | 8.3.5 | 8.3.5 | 2026-10-21 | MIT |
| Three.js | 0.186.1 | 0.186.1 | 2026-09-24 | MIT |
| React Three Fiber | 9.8.2 | 9.8.2 | 2026-10-21 | MIT |
| Drei | 10.7.9 | 10.7.9 | 2026-09-25 | MIT |
| Zustand | 5.0.15 | 5.0.16 | 5.0.15 发布于 2026-08-13；最新包修改于 2026-10-22 | MIT |
| Vitest | 5.0.5 | 5.0.5 | 2026-10-19 | MIT |
| Playwright Test | 1.62.1 | 1.64.1 | 2026-10-22 | Apache-2.0 |

Playwright 固定 1.62.1 以匹配本地已提供的运行库；E2E 使用系统 Chrome 155，因此不依赖 Playwright 自带浏览器 revision。升级需重新执行 Chrome/Edge 兼容测试。

Zustand 未采用 2026-10-22 当天发布的 5.0.16；项目固定 5.0.15，从而无需 pnpm 的最短发布时间例外。

## 数据和资产声明

- 阶段 1 未生成物性 JSON，未引用外部定量性能数据。
- 阶段 1 的 3D 几何、图表占位和 UI 全部由项目源码生成。
- 未下载或分发外部图片、3D 模型、视频、字体或厂商 CAD。
- `docs/ppt_render/` 仅作为本地审查证据，不属于公开部署资产。
