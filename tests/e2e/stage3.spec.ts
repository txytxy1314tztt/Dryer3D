import { expect, test } from '@playwright/test'

test('stage 3 CoolProp charts, timeline, energy flow and 3D share one selection state', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()) })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  await expect(page.getByText('物性校验通过')).toBeVisible()
  await expect(page.getByTestId('refrigerant-states')).toContainText('0.350')
  await expect(page.getByTestId('humid-air-states')).toContainText('RH 85.0%')

  await page.getByTestId('ph-3-4').click()
  await expect(page.getByTestId('selected-component')).toContainText('毛细管')
  await expect(page.getByTestId('selected-process')).toContainText('节流')
  await expect(page.locator('label', { hasText: '循环' }).locator('select')).toHaveValue('refrigerant')
  await expect(page.locator('.step-list li.active')).toContainText('3→4')

  await page.getByTestId('psych-point-humidifying').click()
  await expect(page.getByTestId('selected-component')).toContainText('滚筒')
  await expect(page.locator('.step-list li.active')).toContainText('滚筒吸湿')

  await page.getByTestId('energy-condenser').click()
  await expect(page.getByTestId('selected-component')).toContainText('冷凝器')
  await expect(page.getByTestId('heat-exchange-detail')).toContainText('冷媒 → 壁面 → 空气')
  await expect(page.locator('.cycle-process.active')).toHaveCount(1)

  await page.locator('label', { hasText: '循环' }).locator('select').selectOption('air')
  await expect(page.locator('label', { hasText: '循环' }).locator('select')).toHaveValue('air')
  await page.locator('label', { hasText: '循环' }).locator('select').selectOption('both')
  await expect(page.locator('label', { hasText: '循环' }).locator('select')).toHaveValue('both')

  await page.screenshot({ path: `test-results/stage3-thermo-workbench-${test.info().project.name}.png`, fullPage: true })
  expect(runtimeErrors).toEqual([])
})
