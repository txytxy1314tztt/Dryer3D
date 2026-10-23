# 阶段 2 资产与许可证记录

更新日期：2026-10-23（Asia/Shanghai）

## 交付资产

| 类别 | 来源 | 许可证/权利边界 | 处理方式 |
|---|---|---|---|
| 三类干衣机几何 | 项目内 TypeScript + Three.js 程序化生成 | 项目原创代码；Three.js 为 MIT | 不含厂商 CAD，不声明真实尺寸 |
| 风道、冷媒管路、排水路径 | 项目内 Catmull-Rom 曲线与 TubeGeometry | 项目原创代码；Three.js 为 MIT | 只表达工程拓扑与教学布局 |
| 中文/英文 3D 标注 | 浏览器本地 CanvasTexture + 系统字体栈 | 不打包字体文件，不请求网络字体 | 运行时生成纹理 |
| UI 图形与状态标识 | HTML/CSS/SVG/Canvas 程序化绘制 | 项目原创代码 | 无外部图片 |
| 阶段 2 截图 | 本项目在本机 Chrome 中渲染 | 项目输出物 | 仅作为验收证据 |

## 明确未采用

- 未复制 PPT 中 Panasonic、Gorenje 或其他带水印图片。
- 未下载 Sketchfab、GitHub、厂商网站或素材站的 3D 模型、纹理、图标或字体。
- 未使用 HeyGen/HyperFrames；其确定性视频输出不满足本项目浏览器实时可选取 3D 资产需求。
- 未引入 Blender 生成物、付费 API、订阅或闭源运行时。

完整依赖版本见 `package.json` 与 `pnpm-lock.yaml`，依赖许可证见 `docs/THIRD_PARTY_NOTICES.md`。
