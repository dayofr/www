<script lang="ts" setup>
import type {Post} from './posts.data.ts'
import {data as posts} from './posts.data.js'
import {filterPath} from "./utils";

const {path} = defineProps<{
  path?: string
}>()

let filteredPosts = posts;
if (path) {
  filteredPosts = filterPath(path, posts);
}

function getDateTime(date: Post['date']) {
  return new Date(date.time).toISOString()
}
</script>

<template>
  <template v-for="{ title, url, date, tags } of filteredPosts">
    <article>
      <time :datetime="getDateTime(date)">{{ date.string }}</time>
      <h3><a :href="url">{{ title }}</a></h3>
      <div class="badges">
        <template
            v-for="tag in tags"
        >
          <Badge :text="tag" type="tip"/>
        </template>
      </div>
    </article>
  </template>
</template>

<style scoped>
.badges {
  padding: 8px 0;
}
</style>