# 合法资产与许可证清单

更新日期：2026-10-23（Asia/Shanghai）

## 随交付物分发的资产

| 类别 | 来源 | 许可证/权利边界 | 处理方式 |
|---|---|---|---|
| 三类干衣机几何 | 本项目 TypeScript + Three.js 程序化生成 | 项目原创代码；Three.js 为 MIT | 无厂商 CAD，不声明真实尺寸 |
| 风道、冷媒管路、排水路径 | 本项目曲线与 TubeGeometry | 项目原创代码；Three.js 为 MIT | 表达拓扑和教学布局 |
| 中文/英文 3D 标注 | 浏览器 CanvasTexture + 系统字体栈 | 不分发字体文件，不请求网络字体 | 运行时生成纹理 |
| UI、图表和图标 | HTML/CSS/SVG/Canvas | 项目原创代码 | 无外部图片或图标包 |
| R134a/湿空气 JSON | 本项目脚本调用 CoolProp 7.2.0 生成 | CoolProp MIT；数值附库版本、来源和假设 | 静态教学工况，无后端依赖 |
| NumPy | CoolProp Python 环境依赖 | BSD-3-Clause | 仅构建/测试环境，不打包进网页 |
| 验收截图与指标 JSON | 本项目在本机 Chrome/Edge 渲染 | 项目输出物 | 仅作为可复现验收证据 |

第三方代码依赖的固定版本和许可证见 `package.json`、`pnpm-lock.yaml` 与 `docs/THIRD_PARTY_NOTICES.md`。

## 未采用或不随发布包分发

- PPT 中 Panasonic、Gorenje 或其他带水印图片只用于内部审查，不进入网页和 `dist/`。
- 未下载或分发 Sketchfab、GitHub、厂商网站或素材站的 3D 模型、纹理、图标和字体。
- 未使用 HeyGen/HyperFrames、Blender 生成物、付费 API、订阅或闭源运行时。
- `references/`、`docs/ppt_render/` 与 PPT 提取证据不应加入公开站点部署目录；部署目录仅为 `dist/`。

## 署名要求

若再分发源码或第三方依赖，应保留各依赖的许可证文本和版权声明。网页内“资料/版权”入口标识 CoolProp 和核心开源依赖；正式公开部署前应再次用锁文件生成软件物料清单并复核许可证。
