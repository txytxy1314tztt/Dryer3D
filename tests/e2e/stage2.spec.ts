import { expect, test } from '@playwright/test'
import { writeFileSync } from 'node:fs'

test('stage 2 models, views and fullscreen remain interactive without console errors', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()) })
  await page.goto('/')
  await expect(page.getByTestId('scene-canvas').locator('canvas')).toBeVisible()

  for (const machine of ['vented', 'condenser', 'heat-pump']) {
    await page.getByTestId(`machine-${machine}`).click()
    await page.locator('label', { hasText: '视角' }).locator('select').selectOption('internal')
    await page.waitForTimeout(450)
    await page.screenshot({ path: `test-results/stage2-${machine}-internal.png` })
  }
  await page.locator('label', { hasText: '视角' }).locator('select').selectOption('exploded')
  await page.getByTestId('camera-front').click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'test-results/stage2-front-exploded.png' })

  await page.getByTestId('camera-side').click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'test-results/stage2-side-exploded.png' })

  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.locator('.scene-panel')).toHaveClass(/scene-expanded/)
  await page.waitForTimeout(750)
  await page.screenshot({ path: 'test-results/stage2-fullscreen.png' })
  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.locator('.scene-panel')).not.toHaveClass(/scene-expanded/)

  const perf = await page.evaluate(async () => {
    const started = performance.now()
    for (let frame = 0; frame < 60; frame += 1) await new Promise(requestAnimationFrame)
    const elapsed = performance.now() - started
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    return {
      observedAt: new Date().toISOString(),
      scope: 'local Chrome run; indicative only, not a hardware-independent FPS guarantee',
      observedRafCallbackHz: 60000 / elapsed,
      loadEventMs: navigation?.loadEventEnd ?? null,
      canvasCount: document.querySelectorAll('canvas').length,
      dpr: window.devicePixelRatio,
      domNodes: document.querySelectorAll('*').length,
    }
  })
  writeFileSync('test-results/stage2-browser-metrics.json', `${JSON.stringify(perf, null, 2)}\n`)
  expect(perf.canvasCount).toBe(1)
  expect(perf.domNodes).toBeLessThan(500)
  expect(runtimeErrors).toEqual([])
})
