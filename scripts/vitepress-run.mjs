// 启动脚本：在 Windows 上统一把工作目录的盘符转为大写后再运行 VitePress。
//
// 背景：VitePress 在 Windows 上构建时，会用 process.cwd()（如 e:/...）拼接页面路径，
// 而 Rollup 生成的 chunk.facadeModuleId 使用大写盘符（如 E:/...）。
// 两者盘符大小写不一致会导致页面 chunk 匹配失败，报
// "Cannot read properties of undefined (reading 'imports')"。
// 这里在启动前把 cwd 盘符统一为大写即可根治，且对 macOS / Linux 无副作用。

import { spawnSync } from 'node:child_process'
import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const cwd = process.cwd()
const fixed = /^[a-z]:/i.test(cwd) ? cwd[0].toUpperCase() + cwd.slice(1) : cwd
if (fixed !== cwd) {
  try {
    process.chdir(fixed)
  } catch {
    // 忽略 chdir 失败，交给 VitePress 自行报错
  }
}

// 支持形如 `build pages` 的额外目标标记：命中 `pages` 时设 DEPLOY_ENV=pages，
// 供 config.js 切换 base 为 /toolsweb/（GitHub Pages 项目站），并从传给 vitepress 的参数中剔除。
const args = process.argv.slice(2).filter((a) => {
  if (a === 'pages') {
    process.env.DEPLOY_ENV = 'pages'
    return false
  }
  return true
})
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const vitepressBin = path.resolve(scriptDir, '../node_modules/vitepress/bin/vitepress.js')

const bin = (() => {
  try {
    return require.resolve(vitepressBin)
  } catch {
    return vitepressBin
  }
})()

if (!fs.existsSync(bin)) {
  console.error('找不到 vitepress 可执行文件：', bin)
  process.exit(1)
}

const result = spawnSync(process.execPath, [bin, ...args], {
  stdio: 'inherit',
  windowsHide: true
})

process.exit(result.status ?? 1)
