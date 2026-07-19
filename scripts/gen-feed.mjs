// 零依赖 RSS 生成器 —— 扫描站点内容页，产出标准 RSS 2.0 feed.xml
// 每次构建前自动运行（见 package.json 的 docs:build / docs:build:pages）。
// 不用任何第三方包，避免构建链路被外部依赖拖垮。

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, utimesSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SITE = 'https://shouqi.superhg.cn'
const OUT_DIR = join(ROOT, 'public')
const OUT = join(OUT_DIR, 'feed.xml')

// 需要跳过的目录（避免把 .workbuddy / .git / 构建产物扫进 feed）
const SKIP_DIRS = new Set(['.vitepress', 'node_modules', 'public', 'reference', 'scripts', '.workbuddy', '.git'])

const PAGES = [] // { url, file, mtime }

function collect(relDir) {
  const abs = join(ROOT, relDir)
  let entries
  try {
    entries = readdirSync(abs)
  } catch {
    return
  }
  for (const name of entries) {
    if (name.startsWith('.')) continue
    const p = join(abs, name)
    let st
    try {
      st = statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue
      collect(join(relDir, name))
    } else if (extname(name) === '.md') {
      if (name === '_template.md') continue
      let rel = join(relDir, name).replace(/\\/g, '/')
      rel = rel.slice(0, -3) // 去掉 .md
      if (rel.endsWith('/index')) rel = rel.slice(0, -5) || '/'
      if (rel === 'index') rel = '/' // 根目录 index.md → 站点根
      PAGES.push({
        url: SITE + (rel === '/' ? '/' : '/' + rel),
        file: p,
        mtime: st.mtime
      })
    }
  }
}
collect('')

// 解析 frontmatter 里的基础字段
function parseFrontmatter(file) {
  let raw
  try {
    raw = readFileSync(file, 'utf-8')
  } catch {
    return {}
  }
  const m = raw.match(/^---[\s\S]*?\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[0].split('\n')) {
    const mm = line.match(/^([\w-]+):\s*(.*)$/)
    if (mm) fm[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, '')
  }
  return fm
}

function xmlEscape(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const channel = {
  title: '守器 ShouQi | 独立开发者工具双边平台',
  link: SITE + '/',
  description: '守系出品 · 连接独立开发者与用户的精品工具平台。真实深度测评、水下宝藏挖掘、供需精准对接。',
  language: 'zh-CN'
}

const items = PAGES.map((p) => {
  const fm = parseFrontmatter(p.file)
  // 无 frontmatter 标题时，回退到正文第一个 # 标题
  let h1 = ''
  try {
    const body = readFileSync(p.file, 'utf-8')
    const hm = body.match(/^#\s+(.+)$/m)
    if (hm) h1 = hm[1].trim()
  } catch {}
  const title = fm.title || h1 || (p.url.endsWith('/') ? '守器 ShouQi' : p.url)
  const description = fm.description || fm.subtitle || h1 || '守系出品 · 独立开发者工具平台内容更新'
  let date = p.mtime
  if (fm.date) {
    const d = new Date(fm.date)
    if (!isNaN(d.getTime())) date = d
  }
  return { title, link: p.url, description, date, guid: p.url }
}).sort((a, b) => b.date - a.date)

const rssItems = items
  .map(
    (it) => `    <item>
      <title>${xmlEscape(it.title)}</title>
      <link>${xmlEscape(it.link)}</link>
      <guid isPermaLink="true">${xmlEscape(it.guid)}</guid>
      <description>${xmlEscape(it.description)}</description>
      <pubDate>${it.date.toUTCString()}</pubDate>
    </item>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(channel.title)}</title>
    <link>${xmlEscape(channel.link)}</link>
    <description>${xmlEscape(channel.description)}</description>
    <language>${channel.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT, xml, 'utf-8')
console.log(`[gen-feed] 已生成 ${OUT} —— 共 ${items.length} 条内容`)
