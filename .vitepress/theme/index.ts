// https://vitepress.dev/guide/custom-theme
import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PostList from "./PostList.vue";
import {h} from 'vue'
import BlueSkyComments from "./BlueSkyComments.vue";

export default {
    extends: DefaultTheme,
    enhanceApp({app}) {
        // register your custom global components
        app.component('PostList', PostList)
    },
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'doc-after': () => h(BlueSkyComments)
        })
    }
} satisfies Theme
