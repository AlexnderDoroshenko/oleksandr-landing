import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const exportRoot = path.join(root, 'out')
const siteOrigin = 'https://local.test'
const basePath = process.env.GITHUB_PAGES === 'true' ? '/oleksandr-landing' : ''
const checkExternal = process.argv.includes('--external')
const errors = []
const warnings = []
const internalTargets = new Map()
const externalTargets = new Set()
let verifiedExternal = 0

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(filename) : entry.name.endsWith('.html') ? [filename] : []
  }))
  return nested.flat()
}

function decodeAttribute(value) {
  return value.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/gi, "'").replace(/&amp;/g, '&')
}

function exportedFile(url) {
  let pathname = decodeURIComponent(url.pathname)
  if (basePath) {
    if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return null
    pathname = pathname.slice(basePath.length) || '/'
  }
  const relative = pathname.replace(/^\/+/, '')
  if (relative.split('/').includes('..')) return null
  if (pathname.endsWith('/')) return path.join(exportRoot, relative, 'index.html')
  if (path.extname(pathname)) return path.join(exportRoot, relative)
  return path.join(exportRoot, relative, 'index.html')
}

async function externalStatus(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'oleksandr-landing-link-check/1.0' } })
      await response.body?.cancel()
      if (response.status < 400 || method === 'GET') return response.status
    } catch (error) {
      if (method === 'GET') throw error
    }
  }
  return 0
}

async function main() {
  const pages = await walk(exportRoot)
  for (const page of pages) {
    const html = await readFile(page, 'utf8')
    const pagePath = path.relative(exportRoot, page).replace(/index\.html$/, '').split(path.sep).join('/')
    const pageUrl = `${siteOrigin}${basePath}/${pagePath}`
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(match => decodeAttribute(match[1]))
    for (const href of hrefs) {
      if (!href.trim()) { errors.push(`${page}: empty link`); continue }
      if (/^(mailto:|tel:)/i.test(href)) continue
      let url
      try { url = new URL(href, pageUrl) } catch { errors.push(`${page}: invalid URL ${href}`); continue }
      if (url.protocol !== 'https:' && url.protocol !== 'http:') { errors.push(`${page}: unsupported URL ${href}`); continue }
      if (url.origin !== siteOrigin) { externalTargets.add(url.href); continue }
      const target = exportedFile(url)
      if (!target) { errors.push(`${page}: link outside export base path ${href}`); continue }
      const key = `${target}#${url.hash}`
      if (!internalTargets.has(key)) internalTargets.set(key, { source: page, href, target, hash: url.hash })
    }
  }

  for (const { source, href, target, hash } of internalTargets.values()) {
    try {
      const info = await stat(target)
      if (!info.isFile()) throw new Error('not a file')
      if (hash && target.endsWith('.html')) {
        const id = decodeURIComponent(hash.slice(1))
        const html = await readFile(target, 'utf8')
        if (id && !html.includes(`id="${id}"`) && !html.includes(`name="${id}"`)) errors.push(`${source}: missing anchor ${href}`)
      }
    } catch { errors.push(`${source}: missing exported target ${href}`) }
  }

  if (checkExternal) {
    const links = [...externalTargets]
    let next = 0
    await Promise.all(Array.from({ length: Math.min(8, links.length) }, async () => {
      while (next < links.length) {
        const url = links[next++]
        try {
          const status = await externalStatus(url)
          if (status < 400) verifiedExternal += 1
          if (status === 404 || status === 410) errors.push(`${status}: ${url}`)
          else if (status >= 400) warnings.push(`${status}, could not verify: ${url}`)
        } catch (error) { warnings.push(`Could not verify ${url}: ${error.message}`) }
      }
    }))
    if (links.length && verifiedExternal === 0) errors.push('No external URL could be verified')
  }

  console.log(`Checked ${pages.length} exported pages, ${internalTargets.size} internal targets${checkExternal ? `, ${externalTargets.size} external URLs (${verifiedExternal} verified)` : ''}.`)
  for (const warning of warnings) console.warn(`WARN ${warning}`)
  for (const error of errors) console.error(`FAIL ${error}`)
  if (errors.length) process.exitCode = 1
}

main().catch(error => { console.error(error); process.exitCode = 1 })
