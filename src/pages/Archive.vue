<script setup lang='ts'>
import FlowContainer from '../components/FlowContainer.vue'
import { usePathes } from '../composables/path'
import { fetchPage } from '../client-lib/article-index-helper'
import { ArchiveIndexPage, Directory } from '../shared/index-types'
import { generateRange, joinURL, Time } from '../shared/utils'
import { onMounted, onWatcherCleanup, unref, watch } from 'vue'

import cardStyle from '../styles/layout/card.module.scss'
import ReactiveThreeColumns from '../layouts/ReactiveThreeColumns.vue'
import PageSelector from '../components/PageSelector.vue'
import { usePreferences } from '../composables/preferences'
import { provideLayoutConfigLayer } from '../composables/layout-config'

const idxPrefix = $computed(() => joinURL([unref(usePathes()).themeDir, Directory.ARCHIVE_INDEX]))
const orientation = $toRef(usePreferences(), 'orientation')

provideLayoutConfigLayer('archive')

let currentPageNum = $ref(1)
let currentPage: ArchiveIndexPage | null = $ref(null)
const numTotalPages: number | null = $computed(() => {
  if (currentPage === null) {
    return null
  }
  // if ((currentPage.numTotalItems % currentPage.maxItems) == 0) {
  //   return Math.floor(currentPage.numTotalItems / currentPage.maxItems)
  // } else {
  //   return Math.floor(currentPage.numTotalItems / currentPage.maxItems) + 1
  // }
  return Math.ceil(currentPage.numTotalItems / currentPage.maxItems)
})

const isDev = import.meta.env.DEV

const syncPageNum = (nPage: number) => {
  const url = new URL(location.href)
  url.searchParams.set('page', nPage.toString())
  history.replaceState(null, '', url)
}

onMounted(() => {
  // 从URL参数中获取页数
  {
    const params = new URLSearchParams(location.search)
    let n = parseInt(params.get('page') ?? '1')
    if (isNaN(n) || n < 1) {
      n = 1
    }
    currentPageNum = n

    syncPageNum(n)
  }

  watch($$(currentPageNum), (nPage) => {
    syncPageNum(nPage)

    if (isDev) {
      const time = Date.now()
      const maxItems = 32
      const nBase = (nPage - 1) * maxItems
      currentPage = {
        maxItems,
        numTotalItems: 256,
        items: generateRange(nBase + 0, nBase + maxItems).map((val) => ({
          path: '/',
          timeCreated: time - val * 60 * 10000,
          title: `This is test post ${val}`,
        })),
      }
    } else {
      const controller = new AbortController()
      fetchPage(idxPrefix, nPage - 1, { signal: controller.signal })
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
  <ReactiveThreeColumns mode='center-stressed'>
    <template #center>
      <main :class="['layout-card', cardStyle['card-content']]">
        <h1 class="archive-title">文章归档</h1>
        <div v-if='currentPage !== null' class='info'>
          <div>共{{ (currentPage as ArchiveIndexPage).numTotalItems }}篇</div>
        </div>
        <span v-if='isDev' class="dev-warning">Dev服务器不支持Archive页面，请使用Preview服务器查看本页面</span>

        <div v-if='currentPage !== null' :columns='1' gap='0' class='posts'>
          <a v-for='post in (currentPage as ArchiveIndexPage).items' :key='post.path' :href="post.path"
            class="archive-item flow-item">
            <h3 class="archive-item-title">{{ post.title }}</h3>
            <div class="archive-item-date">{{ Time.formatTimeWithRelative(post.timeCreated, {
              precise: orientation == 'landscape',
            }) }}</div>
          </a>
        </div>

        <div v-else class="loading">正在加载第{{ currentPageNum }}页</div>

        <PageSelector :current-page='currentPageNum' :min-page='1' :max-page='numTotalPages ?? 1'
          @change='(page: number) => currentPageNum = page'></PageSelector>
      </main>
    </template>
  </ReactiveThreeColumns>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/m3-anim';

.layout-card {
  padding: 1.5em;
}

.archive-title {
  font-size: 3rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--pal-onSurface);
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.015em;
}

.info {
  margin-bottom: 1rem;
}

.dev-warning {
  display: block;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: color(from var(--pal-errorContainer) srgb r g b / 0.1);
  color: var(--pal-error);
  border-radius: 12px;
  border: 1px solid var(--pal-errorContainer);
}

.archive-item {
  // background-color: color(from var(--pal-surfaceContainer) srgb r g b / 0.7);
  color: var(--pal-onSurface);
  // border-radius: 20px;
  padding: 0.5rem;
  cursor: pointer;
  text-decoration: none;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: dashed 1px #77777777;
  }
}

.archive-item-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
  color: var(--pal-onSurface);
  text-decoration: none;
  transition: color m3-anim.$expressiveDefaultEffects;

  flex: 1 0 5em;

  &:hover {
    color: var(--pal-primary);
  }
}

.archive-item-date {
  font-size: 0.85rem;
  color: var(--pal-onSurfaceVariant);
  line-height: 1.4;
  margin: 0;

  flex: 0 0 auto;
}

.posts {
  display: flex;
  flex-direction: column;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--pal-onSurfaceVariant);
}
</style>
