<script lang='ts' setup>
import MdiAccount from '~icons/mdi/account'
import MdiDateRange from '~icons/mdi/date-range'
import MdiTag from '~icons/mdi/tag'

import { useData } from 'vitepress'
import { usePageInfo } from '../../composables/page-info'

const { frontmatter, page } = useData()

const pageInfo = usePageInfo()
</script>

<style lang="scss" scoped>
.info-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 0.5em;
}

.tag::before {
  content: "#";
  margin-right: 0.5ch;
}

.tag {
  border: 1px solid var(--pal-outlineVariant);
  border-radius: 0.5em;
  padding: 0.15em 0.4em 0.15em 0.4em;
  font-weight: bold;
  background-color: var(--pal-secondaryContainer);
  color: var(--pal-onSecondaryContainer);
  width: max-content;
}
</style>

<template>
  <header>
    <h1>{{ page.title }}</h1>

    <div v-if='pageInfo.authors.length > 0' class='info-line authors'>
      <MdiAccount /><span class='author' v-for='author in pageInfo.authors'>{{ author }}</span>
    </div>

    <div v-if='pageInfo.lastUpdated' class='info-line last-updated'>
      <MdiDateRange />最后更新于{{ pageInfo.lastUpdated.toLocaleString() }}
    </div>

    <div v-if='frontmatter.tags' class='info-line tags'>
      <MdiTag /><span class='tag' v-for='tag in frontmatter.tags'>{{ tag }}</span>
    </div>

  </header>
</template>