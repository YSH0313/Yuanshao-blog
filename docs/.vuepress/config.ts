import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  base: '/yuanshao-blog/',
  lang: 'zh-CN',
  locales: {
    '/': {
      title: '袁少航',
      lang: 'zh-CN',
      description: '个人日常学习记录及分享',
    },
    '/en/': {
      title: 'HunterX',
      lang: 'en-US',
      description: '个人日常学习记录及分享',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/blog-logo.png' }],
    ['meta', {'meta': 'google-site-verification', 'content': 'TWSCIdeIEIO2M7dTsf4O8YAqpdMNzbQof3DZOaI7Si4'}]
  ],

  plugins: [
      isProd ? googleAnalyticsPlugin({ id: 'G-L1ZLC7XBGS' }): []
  ],

  bundler: viteBundler(),

  theme: plumeTheme({
    // 添加您的部署域名
    hostname: 'https://ysh0313.github.io/',
    // your git repo url
    docsRepo: '',
    docsDir: 'docs',

    plugins: {
      /**
       * Shiki 代码高亮
       * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
       */
      shiki: {
        twoslash: true,
        lineNumbers: 10,
        languages: ['sh', 'ts', 'md', 'html', 'js', 'go', 'kotlin', 'rust', 'vue', 'css', 'json', 'scss', 'yaml', 'bash', 'c++', 'java', 'py', 'ruby', 'make', 'objc', 'swift', 'php', 'rs', 'sql', 'xml', 'zig', 'pug', 'http', 'less', 'styl', 'jsx', 'tsx', 'astro', 'svelte', 'wasm', 'vb', 'bat', 'cs', 'cpp', 'mermaid', 'nginx'],
      },

      /**
       * markdown enhance
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
       */
      markdownEnhance: {
        demo: true,
      //   include: true,
      //   chart: true,
      //   echarts: true,
      //   mermaid: true,
      //   flowchart: true,
      },

      /**
       *  markdown power
       * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
       */
      // markdownPower: {
      //   pdf: true,
      //   caniuse: true,
      //   plot: true,
      //   bilibili: true,
      //   youtube: true,
      //   icons: true,
      //   codepen: true,
      //   replit: true,
      //   codeSandbox: true,
      //   jsfiddle: true,
      //   repl: {
      //     go: true,
      //     rust: true,
      //     kotlin: true,
      //   },
      // },

      /**
       * 评论 comments
       * @see https://theme-plume.vuejs.press/guide/features/comments/
       */
      comment: {
        provider: 'Giscus', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
        comment: true,
        repo: 'YSH0313/YSH0313.github.io',
        repoId: 'R_kgDONicKtg',
        category: 'Q&A',
        categoryId: 'DIC_kwDONicKts4CljKD',
        mapping: 'pathname',
        reactionsEnabled: true,
        inputPosition: 'top',
        darkTheme: 'dark_protanopia',
        lightTheme: 'light_protanopia',
      },
    },
  }),
})
