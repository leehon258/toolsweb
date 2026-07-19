import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点基础信息
  title: '小众工具集 | 独立开发者精品测评平台',
  description: '挖掘小众优质独立工具，连接用户与独立开发者，提供真实深度的工具测评与需求对接',
  base: '/toolsweb/',
  lang: 'zh-CN',

  // 排除非站点内容：原始设计方案、Giscus 教程等参考资料不放进构建
  srcExclude: ['reference/**'],

  // 头部 SEO 全局配置
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.svg' }],
    ['meta', { name: 'keywords', content: '独立工具,效率工具,AI工具,小众软件,独立开发者,工具测评' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:site_name', content: '小众工具精品测评平台' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '小众工具集 | 独立开发者精品测评平台' }],
    ['meta', { property: 'og:description', content: '挖掘小众优质独立工具，连接用户与独立开发者，提供真实深度的工具测评与需求对接' }]
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
      { icon: 'github', link: 'https://github.com/' }
    ],

    // 页脚信息
    footer: {
      message: '用心挖掘每一款被埋没的独立工具',
      copyright: '2025 小众工具测评平台 | 专注独立开发者精品工具挖掘'
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
