import path from 'node:path'
import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNavbar, zhNavbar } from './navbar'
import { enNotes, zhNotes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/blog-logo.png',

  appearance: true,

  social: [
    { icon: 'github', link: 'https://github.com/YSH0313' },
    { icon: 'qq', link: 'https://qm.qq.com/q/GNqAR1Ty8e' },
    {
      icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" d="M12 11l-8 -5h16l-8 5Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/></path><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="64" stroke-dashoffset="64" d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="24" stroke-dashoffset="24" d="M3 6.5l9 5.5l9 -5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="24;0"/></path></g></svg>',
          name: 'email'
      }, link: 'mailto:ysh17600824539@gmail.com'
    },
  ],

  navbarSocialInclude: ['github', 'qq', 'email'],

  footer: {
    message: '',
    copyright: 'Copyright © 2024-present yuanshaohang',
  },

  locales: {
    '/': {
      profile: {
        avatar: '/blog-logo.svg',
        name: '袁少航',
        description: '沉着 冷静 专注 思考',
        // circle: true,
        // location: '',
        // organization: '',
      },

      navbar: zhNavbar,
      notes: zhNotes,
    },
    '/en/': {
      profile: {
        avatar: '/blog-logo.svg',
        name: 'HunterX',
        description: 'Poise, Serenity, Concentration, and Reflection',
        // circle: true,
        // location: '',
        // organization: '',
      },

      navbar: enNavbar,
      notes: enNotes,

      bulletin: {
        layout: 'bottom-right',
        lifetime: 'always',
        title: '🎉 公告 🎉',
        contentFile: path.join(__dirname, 'bulletin-en.md'),
      },
    },
  },
  bulletin: {
    layout: 'bottom-right',
    lifetime: 'always',
    title: '🎉 公告 🎉',
    contentFile: path.join(__dirname, 'bulletin.md'),
  },
})
