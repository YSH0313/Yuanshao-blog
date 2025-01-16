import { defineClientConfig } from 'vuepress/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import CustomComponent from './theme/components/Custom.vue'

// import './theme/styles/custom.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
    app.component('NpmBadge', NpmBadge)
    app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('CustomComponent', CustomComponent)
  },
})
