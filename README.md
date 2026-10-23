# 热泵干衣机 3D 交互式工程教学平台

阶段 4 本地候选交付。平台包含直排式、空气冷凝式和热泵式程序化 3D 教学模型；热泵式具有 R134a 冷媒循环、湿空气循环、CoolProp 离线数据、P-h 图、焓湿图、单位质量能量流和统一教学状态。

## Windows 快速启动

- 开发模式：双击 `start.bat`，访问 `http://127.0.0.1:5173/`。
- 生产预览：双击 `start-production.bat`，访问脚本提示的本地地址。
- 完整检查：双击 `check-all.bat`。

也可在 PowerShell 中运行：

```powershell
cd D:\Projects\Dryer3D
pnpm install --frozen-lockfile
pnpm dev
```

## 构建与测试

```powershell
pnpm exec tsc -b
pnpm test
pnpm physics:test
pnpm build
pnpm test:e2e
```

E2E 使用已安装的系统 Chrome 和 Edge，不自动下载浏览器。详细结果见 `docs/TEST_REPORT.md`。

## 物性数据

网页只读取 `public/data/stage3-thermodynamics.json`，生产运行不需要 Python 后端。重建方式：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-physics.txt
pnpm physics:generate
pnpm physics:test
```

详细假设、算法、版本和适用边界见 `docs/PHYSICS_METHOD.md`。

## 工程边界

- 结构和尺寸为程序化教学示意，不代表具体厂商 CAD 或唯一产品布局。
- 物性点是固定教学工况，不是实测整机、真实衣物动力学或能效认证结果。
- 播放进度、粒子速度和插值不是烘干时间、流量或瞬态仿真。
- 当前没有公开部署；部署必须由用户另行选择平台并授权。

运行、维护和故障排查见 `docs/RUN_AND_MAINTENANCE.md`；最终验收范围见 `docs/FINAL_ACCEPTANCE_CHECKLIST.md`。

