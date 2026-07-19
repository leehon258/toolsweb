import { defineConfig } from 'vitepress'

// base 按部署目标自动切换，实现「子域」与「GitHub Pages」两边并存：
//   - 默认（superhg.cn 子域 / 本地）：'/'
//   - GitHub Pages 项目站（leehon258.github.io/toolsweb/）：设 DEPLOY_ENV=pages → '/toolsweb/'
const base = process.env.DEPLOY_ENV === 'pages' ? '/toolsweb/' : '/'

export default defineConfig({
  // 站点基础信息
  title: '守器 ShouQi | 独立开发者工具双边平台',
  description: '守系出品 · 连接独立开发者与用户的精品工具平台。真实深度测评、水下宝藏挖掘、供需精准对接。',
  base,
  lang: 'zh-CN',

  // 排除非站点内容：原始设计方案、Giscus 教程等参考资料不放进构建
  srcExclude: ['reference/**'],

  // 头部 SEO 全局配置
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.svg' }],
    ['meta', { name: 'keywords', content: '独立工具,效率工具,AI工具,小众软件,独立开发者,工具测评,守器,守系出品' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:site_name', content: '守器 ShouQi' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '守器 ShouQi | 独立开发者工具双边平台' }],
    ['meta', { property: 'og:description', content: '守系出品 · 连接独立开发者与用户的精品工具平台。真实深度测评、水下宝藏挖掘、供需精准对接。' }]
  ],

  // 顶部导航栏（完整产品架构，预留二期入口）
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '工具合集', link: '/tools/' },
      { text: '编辑专栏', link: '/column/' },
      { text: '需求广场', link: '/demand/' },
      { text: '开发者专区', link: '/developer/' },
      { text: '关于本站', link: '/about' }
    ],

    // 侧边栏分组（标准化内容体系）
    sidebar: {
      '/tools/': [
        {
          text: '工具合集',
          items: [
            { text: '全部工具', link: '/tools/' }
          ]
        }
      ],
      '/column/': [
        {
          text: '编辑专栏',
          items: [
            { text: '水下宝藏', link: '/column/underwater' },
            { text: '编辑精选', link: '/column/editor-pick' },
            { text: '月度/年度盘点', link: '/column/monthly-2025-07' }
          ]
        }
      ]
    },

    // 全局搜索开启（原生自带，无需额外开发）
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            placeholder: '搜索工具、开发者、需求...',
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    // 社交链接（页脚）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/leehon258/toolsweb' }
    ],

    // 页脚信息
    footer: {
      message: '守系出品 · 数据自主，隐私可控',
      copyright: '2025 守器 ShouQi | 守系出品'
    },

    // 明暗主题切换
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到亮色模式',
    darkModeSwitchTitle: '切换到暗色模式',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最后更新于',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})
