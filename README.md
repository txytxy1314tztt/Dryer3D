# 热泵干衣机 3D 交互式工程教学平台

当前交付为阶段 1 可运行骨架。它验证三机型导航、程序化 3D 占位、工作台布局、双图表占位、统一状态和测试链路，不包含详细结构或真实物性数据。

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
```

生产预览：

```powershell
pnpm preview --host 127.0.0.1 --port 4173
```

## 工程边界

- 3D 结构均为程序化教学占位，不代表具体产品尺寸或 CAD。
- P-h 图与焓湿图当前无物性数值，不能用于工程计算。
- 播放进度是教学动画相位，不是真实烘干时间。
- 阶段 2 前不会加入详细模型；阶段 3 才生成 CoolProp 物性 JSON。

E2E 在 Windows 上调用 `scripts/run_e2e.ps1`，使用已安装的系统 Chrome，不自动下载浏览器。阶段 1 验收截图位于 `docs/screenshots/stage1-workbench.png`。

