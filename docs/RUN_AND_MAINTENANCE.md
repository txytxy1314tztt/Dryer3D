# Windows 运行与维护手册

更新日期：2026-10-23（Asia/Shanghai）

## 环境

- 必需：Windows 10/11、Node.js 20.19+ 或 22.12+、pnpm 11、支持 WebGL 2 的 Chrome/Edge。
- 仅重建物性数据时需要：Python 3.11、`requirements-physics.txt` 中的 CoolProp/NumPy。
- 不需要 Blender、数据库、云 API 或 Python 后端。

## 首次安装与启动

```powershell
cd D:\Projects\Dryer3D
pnpm install --frozen-lockfile
pnpm dev
```

可双击 `start.bat`。脚本先检查 Node.js 与 pnpm，再启动仅绑定 `127.0.0.1` 的开发服务。

## 生产构建与本地预览

```powershell
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

或双击 `start-production.bat`。静态产物在 `dist/`；部署时只发布该目录，不发布 `references/`、`.venv/`、测试证据或源 PPT。

## 测试

```powershell
pnpm exec tsc -b
pnpm test
pnpm physics:test
pnpm build
pnpm test:e2e
```

`check-all.bat` 顺序执行类型、单元、物理、构建和 E2E。E2E 要求系统 Chrome 与 Edge 位于标准安装路径；脚本不会下载浏览器。

## 重建物性数据

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-physics.txt
pnpm physics:generate
pnpm physics:test
```

生成后必须提交脚本、JSON 和测试的成套变更，并复核 `schemaVersion`、CoolProp 版本、假设及检查结果。详细算法见 `docs/PHYSICS_METHOD.md`。

## 日常维护

1. 依赖升级前检查许可证、Node 兼容性和上游变更日志；修改锁文件后跑全量测试。
2. 改动部件或路径时，同步更新 `src/models/engineering.ts` 的拓扑测试。
3. 改动物性假设时只从生成脚本改，不手改 JSON 或图表数值。
4. 新增资产前记录原始 URL、作者、许可证、署名要求和是否允许再分发。
5. 新增 localStorage 字段前确认非敏感且有默认值、迁移和重置策略。
6. 每次发布记录浏览器版本、命令、测试计数和已知警告。

## 故障排查

- `pnpm` 不存在：安装 pnpm 官方发行版，或用项目批准的 Corepack；不要改用未锁定依赖。
- 端口占用：运行 `pnpm dev -- --port 5174` 或 `pnpm preview -- --port 4174`。
- 黑屏/无 WebGL：更新显卡驱动，确认浏览器硬件加速；先选择“低”画质。
- 图表提示数据加载失败：确认 `public/data/stage3-thermodynamics.json` 存在且部署保持根路径 `/data/`。
- E2E 找不到浏览器：确认 Chrome/Edge 标准安装路径，或在 `playwright.config.ts` 中显式维护系统可执行文件路径。
- 物理测试失败：不要覆盖 JSON；检查 Python 环境、CoolProp 版本和输入假设后重新生成。

