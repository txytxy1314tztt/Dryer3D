# 项目进展

更新日期：2026-10-23（Asia/Shanghai）

## 当前里程碑

阶段 4 本地候选交付已完成。三机型比较、双层解释、版权入口、学习设置、画质自适应和 Windows 脚本已整合；Chrome/Edge 全量 E2E 与物理一致性测试通过。项目在最终本地验收点暂停，未公开部署。

## 阶段 4 新增

1. `src/content/comparison.ts` 提供三类机型十维对比；不凭空给出能耗、价格或寿命数字。
2. `src/content/explanations.ts` 为 7 个冷媒/空气过程提供基础与工程深入内容。
3. `KnowledgeDrawer` 提供工程对比和资料/版权入口，外部链接标注用途与边界。
4. 设置白名单持久化机型、教学层级、结构/相机/标注/循环/画质、倍速与最后步骤；重置恢复默认值。
5. 自动画质根据 `devicePixelRatio`、`hardwareConcurrency`、`deviceMemory`（存在时）和 `prefers-reduced-motion` 选择档位；用户可手动覆盖。
6. Chrome 155.0.8059.85 与 Edge 155.0.4283.62 的 8 个 E2E 组合全部通过；失败请求、`pageerror`、`console.error` 均为空。
7. 最终构建：主包 255.70 kB（gzip 81.39 kB），延迟 WebGL 场景 944.13 kB（gzip 251.34 kB）。后者仍有 Vite 大块警告。
8. Windows 提供 `start.bat`、`start-production.bat`、`check-all.bat`。

## 最终本地验证摘要

- Vitest：4 个文件，14/14 通过。
- Python unittest：7/7 通过。
- Playwright：Chrome/Edge 共 8/8 通过。
- TypeScript：`tsc -b` 通过。
- Vite 生产构建：通过，589 modules。
- 浏览器资源与错误：两浏览器 JSON 200；失败请求、控制台错误和页面异常均为 0。
- 性能：仅为本机自动化观察，详见 `docs/TEST_REPORT.md`；不作为跨硬件 FPS 保证。

## 暂停点

等待用户审核阶段 4 本地交付，并选择 GitHub Pages、Cloudflare Pages、Netlify 或不部署。只有获得明确平台选择和公开部署授权后，才会配置或执行部署。

