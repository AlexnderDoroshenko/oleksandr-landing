import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const exportRoot = join(process.cwd(), 'out')

function exportedRoutes(directory = exportRoot, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (!entry.isDirectory() || entry.name.startsWith('_')) return []
    const route = `${prefix}/${entry.name}`
    const child = join(directory, entry.name)
    return [...(existsSync(join(child, 'index.html')) ? [route] : []), ...exportedRoutes(child, route)]
  })
}

const routes = ['/', ...exportedRoutes()]
const languages = ['en', 'uk'] as const
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const route of routes) for (const lang of languages) {
  test(`${route} ${lang} has no detectable WCAG A/AA violations`, async ({ page }, testInfo) => {
    const response = await page.goto(`${route}?lang=${lang}`, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)
    expect(new URL(page.url()).pathname.replace(/\/$/, '') || '/').toBe(route)
    await expect(page.locator('html')).toHaveAttribute('lang', lang)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.locator('header.site-header')).toHaveCount(1)
    await expect(page).toHaveTitle(/\S/)
    const result = await new AxeBuilder({ page }).withTags(wcagTags).analyze()
    const violations = result.violations.map(violation => ({
      rule: violation.id,
      impact: violation.impact,
      helpUrl: violation.helpUrl,
      targets: violation.nodes.map(node => ({ target: node.target, reason: node.failureSummary })),
    }))
    await testInfo.attach('axe-results', { body: JSON.stringify({ route, lang, violations }, null, 2), contentType: 'application/json' })
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
  })
}

test('keyboard and mobile navigation remain available', async ({ page }, testInfo) => {
  await page.goto('/?lang=uk', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Перейти до вмісту' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeInViewport()
  await expect(page.locator('#main-content')).toBeFocused()
  const menu = page.locator('.mobile-navigation summary')
  if (testInfo.project.name === 'mobile-chromium') {
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('navigation', { name: 'Основна навігація' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'База знань' }).last()).toBeVisible()
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.name === 'mobile-chromium' ? 320 : 1280)
})

test('language and resume selector keep a meaningful variant link', async ({ page }) => {
  await page.goto('/?lang=uk', { waitUntil: 'networkidle' })
  const language = page.getByRole('combobox', { name: 'Мова сайту' })
  await language.focus()
  await language.selectOption('en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const englishLanguage = page.getByRole('combobox', { name: 'Site language' })
  await expect(englishLanguage).toBeFocused()
  await englishLanguage.selectOption('uk')
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  await page.locator('.resume-download summary').click()
  await page.getByRole('combobox', { name: 'Цільова роль' }).selectOption('lead')
  await page.getByRole('button', { name: 'UA' }).click()
  const download = page.getByRole('link', { name: /Завантажити PDF.*QA Automation Lead.*українською/ })
  await expect(download).toHaveAttribute('href', '/resumes/Oleksandr_Doroshenko_QA_Automation_Lead_UK.pdf')
  const pdf = await page.request.get(await download.getAttribute('href') as string)
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()['content-type']).toContain('application/pdf')
})
