import fs from 'node:fs'
import path from 'node:path'

describe('Cloudflare configuration', () => {
  it('uses a fixed compatibility date that is not in the future relative to UTC', () => {
    const configPath = path.join(process.cwd(), 'wrangler.jsonc')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as { compatibility_date: string }
    const utcToday = new Date().toISOString().slice(0, 10)

    expect(config.compatibility_date).toBe('2026-10-01')
    expect(config.compatibility_date <= utcToday).toBe(true)
  })
})
