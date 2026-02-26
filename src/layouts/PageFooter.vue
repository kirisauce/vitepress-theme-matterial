<script lang='ts' setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { ThemeConfig } from '../shared'
import ExternalLink from '../layouts/ExternalLink.vue'
import { useLayoutConfig } from '../composables/layout-config'

const theme = $(useData<ThemeConfig>().theme)

// 获取页脚配置 - 从 layout.footer 获取
const config = $computed(() => useLayoutConfig().value.footer!)

// 处理版权信息中的占位符
const applyPlaceholders = (copyright: string): string => {
  const currentYear = new Date().getFullYear()
  return copyright
    .replace(/{currentYear}/g, String(currentYear))
}

// 处理链接
const links = computed((): Record<string, string> | undefined => {
  let tmpLinks = config?.links
  if (typeof tmpLinks === 'string') {
    let authorName: string = ''
    if (tmpLinks === 'author') {
      authorName = theme.author ?? ''
    } else if (tmpLinks.startsWith('author:')) {
      authorName = tmpLinks.substring('author:'.length)
    }

    if (authorName.length == 0) {
      return undefined
    }

    const author = theme.authorProfiles?.[authorName]
    if (!author) {
      console.warn(`Author profile not found for ${authorName}`)
      return undefined
    }
    return author.externalLinks ?? {}
  } else if (typeof tmpLinks === 'object' && tmpLinks !== null) {
    return tmpLinks as Record<string, string>
  } else {
    if (tmpLinks !== undefined && tmpLinks !== null) {
      console.warn(`Invalid links configuration: ${tmpLinks}`)
    }
    return undefined
  }
})

// 处理版权信息
const copyrightText = computed(() => applyPlaceholders(config?.copyright!))
</script>

<template>
  <footer v-if='config' class='page-footer'>
    <div class='footer-content'>
      <!-- 外部链接 -->
      <div v-if='links' class='footer-links'>
        <ExternalLink v-for='(link, siteName) in links!' :key='siteName' :site-name='siteName' :link='link' display='iconAndName' />
      </div>

      <!-- 主题信息 -->
      <div v-if='config?.themeInfo' class='footer-extra' v-html='config.themeInfo'></div>

      <!-- 额外文本 -->
      <div v-if='config?.extra' class='footer-extra' v-html='config.extra' />

      <!-- 版权信息 -->
      <div v-if='copyrightText' class='footer-copyright'>
        {{ copyrightText }}
      </div>
    </div>
  </footer>
</template>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';
@use '../styles/abstract/font';

.page-footer {
  width: 100%;
  padding: 2rem 1rem;
  background-color: var(--pal-surfaceContainer);
  color: var(--pal-onSurfaceVariant);
  margin-top: auto;
  font-family: font.$monospace;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.footer-copyright {
  font-size: 0.9rem;
  color: var(--pal-onSurface);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.footer-extra {
  font-size: 0.85rem;
  color: var(--pal-onSurfaceVariant);
  text-align: center;
}
</style>
