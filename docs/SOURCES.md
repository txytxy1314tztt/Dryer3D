# 参考资料与来源登记

访问日期：2026-10-23（Asia/Shanghai）

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

## 阶段 2 结构依据与适用边界

- 热泵回路拓扑与空气闭式循环继续采用上表 ENERGY STAR 与 DOE/ORNL 官方资料作为原理依据。
- 空气冷凝式以“过程空气闭式循环、环境空气作为独立冷却流、隔壁换热凝露”为教学边界；具体风机数量和安装方位不表述为行业唯一结构。
- 直排式以“环境进气、热源、滚筒、过滤/风机、室外排风”为边界，不加入未经来源支持的能耗比较数字。
- 结构比例与部件位置缺少 CAD/拆机尺寸依据，全部按教学可视化布置并在 UI 持续标注“教学示意 · 非真实尺寸”。
- 阶段 2 未新增外部资产；详细清单见 `docs/ASSET_LICENSES.md`。

## 阶段 3 物性实现记录

- 实际安装并调用 CoolProp 7.2.0，git revision `98b3523d5daa98454618d381d2ae53f7471d216b`；输出 JSON 保存版本和 MIT 许可证标识。
- R134a 状态、饱和穹顶和相态使用 `PropsSI` / `PhaseSI`；湿空气状态、RH 曲线和等焓线使用 `HAPropsSI`。
- 官方 R134a、Humid Air 和 High-Level API 页面是原理与接口依据；项目工况假设、计算过程和适用边界见 `docs/PHYSICS_METHOD.md`。
- 未采用普通教程中的手绘 P-h 数值、经验 COP 或未经验证的焓湿图坐标。

## 阶段 4 部署资料（只用于方案比较）

| 官方来源 | 用途 | 当前决策 |
|---|---|---|
| [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | 公共仓库条件、站点/带宽/构建限制 | 仅候选；项目页部署前需配置 Vite 子路径 |
| [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) | 构建、文件、项目和域名限制 | 仅候选；未创建项目 |
| [Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/) | 静态资产请求与 Functions 计费边界 | 本项目不需要 Functions |
| [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) | 免费层、信用点和暂停行为 | 仅候选；信用点复杂度较高 |

没有进行公开部署、账户连接或令牌配置。完整比较见 `docs/DEPLOYMENT_OPTIONS.md`。
