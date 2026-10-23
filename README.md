# 热泵干衣机 3D 交互式工程教学平台

当前交付为阶段 3 物理联动候选版。它在阶段 2 模型上增加 CoolProp 预计算 R134a/湿空气数据、真实 P-h/焓湿图、单位质量能量流、分段双循环动画、多尺度换热视图和统一教学时间线。

## 启动

```powershell
cd D:\Projects\Dryer3D
pnpm install --frozen-lockfile
pnpm dev
```

也可以双击 `start.bat`。默认地址为 `http://127.0.0.1:5173`。

## 构建与测试

```powershell
pnpm test
pnpm build
pnpm test:e2e
pnpm physics:test
```

生产预览：

```powershell
pnpm preview --host 127.0.0.1 --port 4173
```

## 工程边界

- 3D 结构均为程序化教学示意，不代表具体产品尺寸、CAD 或任一厂商唯一布局。
- P-h 图与焓湿图来自固定 CoolProp 教学工况，但不是经过实机标定的整机动态仿真。
- 播放进度是教学动画相位，不是真实烘干时间。
- 动画插值只表达拓扑、方向和教学同步，不映射真实烘干时间。

E2E 在 Windows 上调用 `scripts/run_e2e.ps1`，使用已安装的系统 Chrome，不自动下载浏览器。阶段 2 多角度截图位于 `docs/screenshots/`。

## 重建物性数据

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-physics.txt
pnpm physics:generate
pnpm physics:test
```

网页只读取 `public/data/stage3-thermodynamics.json`，生产运行不需要 Python 服务。详细方法见 `docs/PHYSICS_METHOD.md`。

