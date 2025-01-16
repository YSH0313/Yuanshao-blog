import {defineNoteConfig, defineNotesConfig} from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

const zhDemoNote = defineNoteConfig({
    dir: 'opencraft',
    link: '/opencraft',
    sidebar: 'auto',
})

export const zhNotes = defineNotesConfig({
    dir: 'notes',
    link: '/',
    notes: [zhDemoNote],
})

/* =================== locale: en-US ======================= */

const enLinuxNote = defineNoteConfig({
    dir: '1.linux',
    link: '/linux',
    sidebar: 'auto',
})

const enDockerNote = defineNoteConfig({
    dir: '2.docker',
    link: '/docker',
    sidebar: 'auto',
})

const enNginxNote = defineNoteConfig({
    dir: '3.nginx',
    link: '/nginx',
    sidebar: 'auto',
})

const enVueNote = defineNoteConfig({
    dir: '4.vue',
    link: '/vue',
    sidebar: 'auto',
})

const engrpcNote = defineNoteConfig({
    dir: '5.gRPC',
    link: '/gRPC',
    sidebar: 'auto',
})

const encodeNote = defineNoteConfig({
    dir: '6.code',
    link: '/code',
    sidebar: 'auto',
})

const enDatabaseNote = defineNoteConfig({
    dir: '7.database',
    link: '/database',
    sidebar: 'auto',
})

const enToolsNote = defineNoteConfig({
    dir: '8.tools',
    link: '/tools',
    sidebar: 'auto',
})

const enRelaxNote = defineNoteConfig({
    dir: 'relax',
    link: '/relax',
    sidebar: 'auto',
})

const enOpencraftNote = defineNoteConfig({
    dir: 'opencraft',
    link: '/opencraft',
    sidebar: 'auto',
})

export const enNotes = defineNotesConfig({
    dir: 'en/notes',
    link: '/en/',
    notes: [
        enLinuxNote,
        enDockerNote,
        enNginxNote,
        enVueNote,
        engrpcNote,
        encodeNote,
        enDatabaseNote,
        enToolsNote,
        enRelaxNote,
        enOpencraftNote,
    ]
})

