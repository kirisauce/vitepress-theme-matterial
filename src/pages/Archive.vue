<script setup lang='ts'>
import FlowContainer from '../components/FlowContainer.vue'
import { usePathes } from '../composables/path'
import { fetchPage } from '../client-lib/article-index-helper'
import { ArchiveIndexPage, Directory } from '../shared/index-types'
import { generateRange, joinURL, Time } from '../shared/utils'
import { onMounted, onWatcherCleanup, unref, watch } from 'vue'

import cardStyle from '../styles/layout/card.module.scss'
import ReactiveThreeColumns from '../layouts/ReactiveThreeColumns.vue'
import Navigator from '../layouts/Navigator.vue'

const idxPrefix = $computed(() => joinURL([unref(usePathes()).themeDir, Directory.ARCHIVE_INDEX]))

let currentPageNum = $ref(0)
let currentPage: ArchiveIndexPage | null = $ref(null)

const isDev = import.meta.env.DEV

onMounted(() => {
  watch($$(currentPageNum), (nPage) => {
    if (isDev) {
      const time = Date.now()
      currentPage = {
        maxItems: 100,
        numTotalItems: 1,
        items: generateRange(0, 8).map((val) => ({
          path: '/',
          timeCreated: time - val * 60 * 10000,
          title: `This is test post ${val}`,
        })),
      }
    } else {
      const controller = new AbortController()
      fetchPage(idxPrefix, nPage, { signal: controller.signal })
        .catch((reason) => { throw Error(`Error loading index page ${nPage}:\n${reason}`) })
        .then((page) => {
          currentPage = page
        })

      onWatcherCleanup(() => {
        controller.abort()
      })
    }
  }, { immediate: true })
})
</script>

<template>
  <Navigator />

  <ReactiveThreeColumns>
    <template #center>
      <div :class="['layout-card', cardStyle['card-content']]">
        <span v-if='isDev'>Dev服务器不支持Archive页面，请使用Preview服务器查看本页面</span>

        <FlowContainer v-if='currentPage !== null' :columns='3' gap='1rem' min-column-width='300'>
          <div v-for='post in (currentPage as ArchiveIndexPage).items' :key='post.path' class='flow-item'>
            <div>
              <h3>{{ post.title }}</h3>
              <div class='date'>{{ Time.formatTimeWithRelative(post.timeCreated) }}</div>
            </div>
          </div>
        </FlowContainer>

        <div v-else>Loading page {{ currentPageNum }}</div>
      </div>
    </template>
  </ReactiveThreeColumns>
</template>

<style lang="scss" scoped>
.layout-card {
  padding: 1em;
}
</style>
