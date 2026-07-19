import DefaultTheme from 'vitepress/theme'
import './style.css'
import { h } from 'vue'

// ============================================================
// Giscus 全站评论区配置
// 仓库：leehon258/toolsweb（公开）| 分类：General（访客可自由发帖）
// 参数由 GitHub GraphQL API 反查生成，已可直接使用。
// 如需更换仓库/分类，去 https://giscus.app 重新生成后替换即可。
// ============================================================
const giscusConfig = {
  'data-repo': 'leehon258/toolsweb',
  'data-repo-id': 'R_kgDOTc8uJg',
  'data-category': 'General',
  'data-category-id': 'DIC_kwDOTc8uJs4DBf_Q',
  'data-mapping': 'pathname',
  'data-strict': '1',
  'data-reactions-enabled': '1',
  'data-emit-metadata': '0',
  'data-input-position': 'bottom',
  'data-theme': 'preferred_color_scheme',
  'data-lang': 'zh-CN',
  'data-lazy': '1',
  crossorigin: 'anonymous',
  async: true
}

export default {
  extends: DefaultTheme,

  // 通过 doc-after 插槽，在每篇文档底部自动挂载 Giscus 评论区
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h('div', { class: 'giscus' }, [
        h('script', {
          src: 'https://giscus.app/client.js',
          ...giscusConfig
        })
      ])
    })
  },

  enhanceApp({ app }) {
    // 后续可在此注册 Vue 组件（工具卡片、评分组件等）
  }
}
