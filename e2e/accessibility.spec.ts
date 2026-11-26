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
    if (testInfo.project.name === 'desktop-chromium') {
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href') ?? ''))
      for (const href of new Set(hrefs)) {
        expect(href, `${route} ${lang} has an empty link`).not.toBe('')
        const target = new URL(href, page.url())
        if (target.origin !== new URL(page.url()).origin) continue
        const linkedPage = await page.request.get(target.toString())
        expect(linkedPage.status(), `${route} ${lang}: ${href}`).toBe(200)
        if (target.hash && linkedPage.headers()['content-type']?.includes('text/html')) {
          const id = decodeURIComponent(target.hash.slice(1))
          if (id) expect(await linkedPage.text(), `${route} ${lang}: missing ${target.hash}`).toContain(`id="${id}"`)
        }
      }
    }
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

test('roadmap progress persists across reload and language switch', async ({ page }) => {
  await page.goto('/knowledge/roadmap/?lang=uk', { waitUntil: 'networkidle' })
  const firstMilestone = page.getByRole('checkbox', { name: 'Позначити виконаним' }).first()
  await firstMilestone.check()
  await expect(page.getByRole('progressbar', { name: 'Ваш прогрес' })).toHaveAttribute('value', '1')

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('checkbox', { name: 'Виконано' }).first()).toBeChecked()
  await page.getByRole('combobox', { name: 'Мова сайту' }).selectOption('en')
  await expect(page).toHaveURL(/\/knowledge\/roadmap\/\?lang=en/)
  await expect(page.getByRole('progressbar', { name: 'Your progress' })).toHaveAttribute('value', '1')
  await expect(page.getByRole('link', { name: 'Study this topic: Testing theory' })).toHaveAttribute('href', '/knowledge/testing-theory/?lang=en')
})

test('knowledge practice explains an answer and self-check highlights gaps in both languages', async ({ page }) => {
  await page.goto('/knowledge/check/?lang=uk', { waitUntil: 'networkidle' })
  const practice = page.locator('#check-foundation-practice')
  await practice.getByRole('radio').first().check()
  await expect(practice.getByText('Варто повторити')).toBeVisible()
  await expect(practice.getByRole('link', { name: 'Повторити тему' })).toHaveAttribute('href', '/knowledge/testing-theory/?lang=uk')
  await practice.getByRole('link', { name: 'Повторити тему' }).click()
  await expect(page).toHaveURL(/\/knowledge\/testing-theory\/\?lang=uk/)
  await expect(page.getByRole('heading', { level: 1, name: 'Теорія тестування' })).toBeVisible()
  await page.goBack({ waitUntil: 'networkidle' })

  const depth = page.locator('#depth')
  for (const card of await depth.locator('.check-card').all()) await card.getByRole('radio', { name: 'Поки не знаю' }).check()
  await depth.getByRole('button', { name: 'Показати теми для повторення' }).click()
  const report = page.locator('#check-report')
  await expect(report).toBeFocused()
  await expect(report.locator('.check-report-areas section')).toHaveCount(6)
  await expect(report.getByText('0 / 18')).toBeVisible()

  await page.getByRole('combobox', { name: 'Мова сайту' }).selectOption('en')
  await expect(page).toHaveURL(/\/knowledge\/check\/\?lang=en/)
  await expect(report.getByText('Your learning overview')).toBeVisible()
  await expect(report.getByText('Not sure yet').first()).toBeVisible()
  await expect(page.locator('.check-samples li')).toHaveCount(4)
  await expect(page.locator('.check-samples a')).toHaveCount(8)
})
