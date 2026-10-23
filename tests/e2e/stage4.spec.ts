import { expect, test } from '@playwright/test'
import { writeFileSync } from 'node:fs'

test('stage 4 integration, persistence, resources and performance', async ({ page, request }, testInfo) => {
  const runtimeErrors: string[] = []
  const failedRequests: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()) })
  page.on('requestfailed', (failed) => failedRequests.push(`${failed.url()} :: ${failed.failure()?.errorText}`))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.getByText('STAGE 04')).toBeVisible()
  await expect(page.getByTestId('scene-canvas').locator('canvas')).toBeVisible()

  await page.getByTestId('open-comparison').click()
  await expect(page.getByTestId('comparison-table')).toContainText('室外排风')
  await expect(page.getByTestId('comparison-table')).toContainText('完整制冷系统')
  await page.getByRole('button', { name: '关闭 ×' }).click()

  await page.locator('.control-rail button', { hasText: '工程深入' }).click()
  await expect(page.getByTestId('depth-explanation')).toContainText('h₂')
  await page.getByTestId('open-comparison').click()
  await expect(page.getByTestId('comparison-table')).toContainText('不提供无来源的购置价')
  await page.getByRole('button', { name: '关闭 ×' }).click()

  await page.getByTestId('open-references').click()
  await expect(page.getByTestId('references-view')).toContainText('CoolProp')
  await expect(page.getByTestId('references-view')).toContainText('未打包 PPT 厂商图片')
  await page.getByRole('button', { name: '关闭 ×' }).click()

  await page.getByTestId('machine-condenser').click()
  await page.getByTestId('quality-select').selectOption('low')
  await page.locator('label', { hasText: '视角' }).locator('select').selectOption('exploded')
  await page.locator('.control-rail button', { hasText: '自由探索' }).click()
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('dryer3d-learning-preferences-v1'))).not.toBeNull()
  await page.reload()
  await expect(page.getByTestId('machine-condenser')).toHaveClass(/active/)
  await expect(page.getByTestId('quality-select')).toHaveValue('low')
  await expect(page.locator('label', { hasText: '视角' }).locator('select')).toHaveValue('exploded')
  await expect(page.locator('.control-rail button', { hasText: '自由探索' })).toHaveClass(/active/)
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('dryer3d-learning-preferences-v1') ?? '{}'))
  expect(Object.keys(saved.state).sort()).toEqual(['cameraPreset','circuit','depth','labelMode','machine','mode','quality','speed','step','viewMode'].sort())

  await page.locator('.transport-bar .text-button', { hasText: '重置' }).click()
  await expect(page.getByTestId('machine-heat-pump')).toHaveClass(/active/)
  await expect(page.getByTestId('quality-select')).toHaveValue('auto')
  await expect(page.locator('.control-rail button', { hasText: '基础讲解' })).toHaveClass(/active/)

  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.locator('.scene-panel')).toHaveClass(/scene-expanded/)
  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.locator('.scene-panel')).not.toHaveClass(/scene-expanded/)
  await page.waitForTimeout(900)

  const dataResponse = await request.get('/data/stage3-thermodynamics.json')
  expect(dataResponse.ok()).toBe(true)
  expect(dataResponse.headers()['content-type']).toContain('application/json')
  const payload = await dataResponse.json()
  expect(payload.library.version).toBe('7.2.0')
  expect(payload.refrigerant.checks.energyBalanceErrorKJkg).toBe(0)

  const metrics = await page.evaluate(async () => {
    const started = performance.now()
    for (let frame = 0; frame < 60; frame += 1) await new Promise(requestAnimationFrame)
    const elapsed = performance.now() - started
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const canvas = document.querySelector('canvas')
    const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl')
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
    return {
      measuredAtUtc: new Date().toISOString(),
      scope: 'local automated browser observation; not a universal hardware guarantee',
      loadEventMs: navigation?.loadEventEnd ?? null,
      domNodes: document.querySelectorAll('*').length,
      resourceCount: resources.length,
      transferBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
      observedRafCallbackHz: 60000 / elapsed,
      usedJSHeapBytes: memory?.usedJSHeapSize ?? null,
      webgl: gl ? `${gl.getParameter(gl.VERSION)} / ${gl.getParameter(gl.RENDERER)}` : null,
      canvasCount: document.querySelectorAll('canvas').length,
    }
  })
  expect(metrics.canvasCount).toBe(1)
  expect(metrics.domNodes).toBeLessThan(1000)
  expect(metrics.observedRafCallbackHz).toBeGreaterThan(20)
  expect(metrics.loadEventMs ?? 99999).toBeLessThan(5000)
  expect(failedRequests).toEqual([])
  expect(runtimeErrors).toEqual([])

  const evidence = { project: testInfo.project.name, runtimeErrors, failedRequests, metrics }
  writeFileSync(`docs/STAGE4_BROWSER_METRICS-${testInfo.project.name}.json`, `${JSON.stringify(evidence, null, 2)}\n`)
  await page.screenshot({ path: `docs/screenshots/stage4-final-${testInfo.project.name}.png`, fullPage: true })
})
