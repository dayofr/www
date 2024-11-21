import {defineConfig} from 'vitepress'
import {genFeed} from "./genFeed";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "DayoFr",
    description: "Mes notes",
    themeConfig: {
        search: {
            provider: 'local'
        },
        footer: {
            copyright: 'Copyright © 2019-present DayoFr'
        }
    },
    buildEnd: genFeed,
    sitemap: {
        hostname: 'https://dayo.fr'
    }
})
