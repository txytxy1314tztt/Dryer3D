# 热泵干衣机 3D 交互式工程教学平台

当前交付为阶段 2 模型候选版。它包含三机型程序化教学模型、热泵关键部件与管路、五种结构模式、相机预设、部件选择、智能标注和 3D 全屏；双图表仍为阶段 1 占位，不包含真实物性数据。

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

- 3D 结构均为程序化教学示意，不代表具体产品尺寸、CAD 或任一厂商唯一布局。
- P-h 图与焓湿图当前无物性数值，不能用于工程计算。
- 播放进度是教学动画相位，不是真实烘干时间。
- 阶段 3 才生成 CoolProp 物性 JSON；当前流动粒子只表达拓扑和方向。

E2E 在 Windows 上调用 `scripts/run_e2e.ps1`，使用已安装的系统 Chrome，不自动下载浏览器。阶段 2 多角度截图位于 `docs/screenshots/`。

