# 免费静态部署方案比较（未执行）

核对日期：2026-10-23（Asia/Shanghai）。平台配额可能变化，执行部署前应再次核对官方页面。

| 方案 | 免费层与约束 | 本项目适配 | 代价/注意事项 |
|---|---|---|---|
| GitHub Pages | GitHub Free 的公开仓库可用；站点建议不超过 1 GB，软带宽 100 GB/月，软构建 10 次/小时，部署超时 10 分钟 | 纯静态站、版本和源码同库，维护最简单 | 项目页位于子路径时必须在授权后设置 Vite `base` 并复测 JSON/资源路径；不适合不愿公开源码的情况 |
| Cloudflare Pages | 免费层 500 builds/月、单并发、20 分钟构建、20,000 文件、单文件 25 MiB；静态资源请求免费且不限量 | 当前根路径静态产物易接入，全球 CDN；可连接 Git 或直接上传 | 需要第三方账户/项目授权；Pages 与 Workers 产品路线需在部署时再次确认 |
| Netlify Free | $0、300 credits/月、单并发、支持自定义域名/SSL/CDN/预览；额度耗尽项目可能暂停 | Vite 静态站接入成熟 | 信用点模型较复杂：生产部署、带宽和请求都会消耗额度，需持续观察 |

官方依据：

- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Pages overview](https://developers.cloudflare.com/pages/)
- [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Netlify credits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)

## 建议

- 若仓库允许公开且希望最少平台依赖：优先 GitHub Pages，但先增加仓库子路径 `base` 配置与回归测试。
- 若希望直接发布现有 `dist/`、使用独立域名或保留仓库可见性选择：优先评估 Cloudflare Pages。
- Netlify 可用，但本项目无服务端能力需求，信用点计费增加了不必要的运维判断。

当前状态：没有创建平台项目、没有上传 `dist/`、没有写入令牌，也没有公开 URL。等待用户选择平台并明确授权后再执行。

