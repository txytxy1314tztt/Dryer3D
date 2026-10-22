# Windows 开发环境审查

审查日期：2026-10-22（Asia/Shanghai）

## 必需工具

| 工具 | 本机状态 | 用途 | 安装来源 | 许可证 | 替代方案 |
|---|---|---|---|---|---|
| Node.js | v24.18.0，可用 | 前端开发、构建和测试 | 已安装；官方下载来源待联网核验 | Node.js 许可证，待联网核验具体文本 | 受支持的 Node LTS |
| npm 或 pnpm | npm 12.0.2；pnpm 11.25.0 | 依赖安装与脚本运行 | 已安装/内置运行时 | 各自许可证待联网核验 | 二选一；建议项目固定 pnpm |
| Git | 2.53.0.windows.3 | 版本管理 | 已安装 | GPL-2.0 系列，具体分发说明待核验 | 无合理替代；可先本地使用 |
| 现代浏览器 | Chrome 155、Edge 155 | WebGL 与交互验收 | 已安装 | 浏览器自身许可 | 任一 Chromium 浏览器 |

## 推荐工具

| 工具 | 本机状态 | 用途 | 安装来源 | 许可证 | 替代方案 |
|---|---|---|---|---|---|
| Python | 内置 3.12.14，可用 | PPT 提取；阶段 3 物性预计算 | Codex 内置运行时 | Python PSF，具体分发依赖待核验 | 独立 Python 3.11/3.12 |
| CoolProp | 未安装 | R134a 与湿空气物性 | 官方 PyPI/项目发布，待批准后核验 | MIT 预期，待官方核验 | 经验证的开源公式实现；工作量更高 |
| Playwright | 项目固定 1.62.1 | 浏览器自动化与截图 | npm 项目依赖 | Apache-2.0（npm 元数据） | 系统 Chrome/Edge 手工验收 |
| PowerPoint | 16.0.20326.20232 | 参考 PPT 视觉导出 | 已安装 | 商业软件，本项目不分发 | LibreOffice Impress；需另行核验版式 |

## 可选工具

| 工具 | 本机状态 | 用途 | 采用条件 | 替代方案 |
|---|---|---|---|---|
| Blender | 未找到 | 阶段 2 必要时编辑程序化或合法模型 | 只有浏览器内建模不足时才申请安装 | Three.js/R3F 程序化建模 |
| LibreOffice | 未检查 | PPT/PDF 兼容性辅助 | PowerPoint 不可用时 | 当前 PowerPoint 已可用 |

## 路径与兼容性观察

- `python` 命令指向失效的 Hermes 跳板，直接运行报权限错误；项目脚本应显式发现可用 Python，不能假定 PATH 中的 `python` 正常。
- Chrome、Edge 和 PowerPoint 未加入 PATH，但标准安装位置存在。
- Node 24 满足 Vite 8.3.5 的 `^20.19.0 || >=22.12.0` 和 Vitest 5.0.5 的 `^22.12.0 || ^24.0.0 || >=26.0.0` 要求，且构建、单测已实测通过。
- 系统信息 API `Get-CimInstance Win32_OperatingSystem` 因权限被拒；PowerShell 报告内核为 Microsoft Windows 10.0.26300。文档不据此猜测具体 Windows 产品版本。

## Skills 审查

| Skill | 状态 | 阶段 1 用途 | 决策 |
|---|---|---|---|
| Presentations | 本地可用，已使用 | 约束 PPT 读取、渲染和证据提取流程 | 保留 |
| OpenAI Docs | 本地可用，已使用 | 官方核对 Codex Skills 能力边界 | 保留，不安装新 Skill |
| Computer Use | 本地可用 | 只有 CLI 自动化无法覆盖的 GUI 验收才使用 | 暂不使用 |
| HyperFrames | 本地可用，官方资料已核验 | HTML 到确定性视频、MP4/WebM/MOV 导出 | 不作为交互 3D 资产依赖；可渲染 Three.js 视频，但输出目标是固定视频，不是本平台所需交互工程资产 |
| ImageGen | 本地可用 | 可生成位图，不适合工程拓扑可验证的 3D 结构 | 不使用 |
| Blender 相关 Skill | 未列出专用技能 | 非必需 | 不阻塞开发 |

本地 Skill 目录只证明当前环境暴露了相应能力，不代表官方兼容性、价格或长期维护承诺。相关结论需在获准后查官方资料。

