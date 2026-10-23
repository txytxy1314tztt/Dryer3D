import { expect, test } from '@playwright/test'

test('stage 1 workbench loads and links chart selection to engineering context', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  await page.goto('/')
  await expect(page.getByText('热泵干衣机 3D 工程教学平台')).toBeVisible()
  await expect(page.getByTestId('scene-canvas').locator('canvas')).toBeVisible()

  await page.getByTestId('machine-vented').click()
  await expect(page.locator('.scene-panel h2')).toContainText('直排式')
  await page.getByTestId('machine-heat-pump').click()

  await page.getByTestId('ph-1-2').click()
  await expect(page.getByTestId('selected-component')).toContainText('压缩机')
  await expect(page.getByTestId('selected-process')).toContainText('压缩')

  await page.screenshot({ path: 'test-results/stage1-workbench.png', fullPage: true })
  expect(runtimeErrors).toEqual([])
})
