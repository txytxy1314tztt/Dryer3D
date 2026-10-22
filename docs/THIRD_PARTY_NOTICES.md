# 第三方依赖登记

阶段 1 直接运行时依赖：React、React DOM、Three.js、React Three Fiber、Drei、Zustand，均通过 npm 元数据标记为 MIT。

阶段 1 开发依赖：TypeScript（Apache-2.0）、Vite（MIT）、Vitest（MIT）、Playwright Test（Apache-2.0）及相应 MIT 类型包。

完整可复现版本记录在 `package.json` 与 `pnpm-lock.yaml`。生产依赖已执行 `pnpm audit --prod`，2026-10-22 结果为 `No known vulnerabilities found`。该结果只代表审查时 npm advisory 数据库中的已知问题，不构成未来安全保证。

项目未打包任何外部图片、视频、字体或 3D 模型。原 PPT 媒体只保留在本地审查证据目录，不进入 `src/`、`public/` 或生产构建。
