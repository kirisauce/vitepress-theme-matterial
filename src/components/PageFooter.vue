<script lang='ts' setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useThemeRouter } from '../composables/theme-router'
import { ThemeConfig } from '../shared'
import SvgContainer from './SvgContainer.vue'
import ExternalLink from '../layouts/ExternalLink.vue'

const { site, theme } = useData<ThemeConfig>()
const themeRouter = useThemeRouter()

// 获取页脚配置 - 从 layout.footer 获取
const config = $computed(() => theme.value.layout?.footer)

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
      authorName = theme.value.author ?? ''
    } else if (tmpLinks.startsWith('author:')) {
      authorName = tmpLinks.substring('author:'.length)
    }

    if (authorName.length == 0) {
      return undefined
    }

    const author = theme.value.authorProfiles?.[authorName]
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

// 获取许可证信息
const license = $computed(() => {
  // 如果配置明确设置 showLicense 为 false，则不显示
  if (config?.showLicense === false) return null

  const licenseKey = theme.value.license?.default
  if (!licenseKey) return null

  return theme.value.license?.licenses?.[licenseKey]
})

// 获取许可证家族图标
const licenseFamily = $computed(() => {
  if (!license?.family) return null
  return theme.value.license?.families?.[license.family]
})
</script>

<template>
  <footer class='page-footer'>
    <div class='footer-content'>
      <!-- 版权信息 -->
      <div v-if='copyrightText' class='footer-copyright'>
        {{ copyrightText }}
      </div>

      <!-- 外部链接 -->
      <div v-if='links' class='footer-links'>
        <ExternalLink v-for='(link, siteName) in links!' :key='siteName' :site-name='siteName' :link='link' display='iconAndName' />
      </div>

      <!-- 许可证信息 -->
      <div v-if='license' class='footer-license' @click='themeRouter?.tryOpen(license.url)'>
        <div class='footer-license-name'>{{ license.name }}</div>
        <span class='footer-license-description'>{{ license.footerDescription }}</span>
        <div v-if='licenseFamily' class='footer-license-layer-logo'>
          <SvgContainer :no-margin='true' class='footer-license-logo' v-html='licenseFamily.logo' />
        </div>
      </div>

      <!-- 额外文本 -->
      <div v-if='config?.extraText' class='footer-extra' v-html='config.extraText' />
    </div>
  </footer>
</template>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';

.page-footer {
  width: 100%;
  padding: 2rem 1rem;
  background-color: var(--pal-surfaceContainer);
  color: var(--pal-onSurfaceVariant);
  margin-top: auto;
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

.footer-license {
  position: relative;
  background-color: var(--palext-primaryTransparent);
  color: var(--pal-onPrimary);
  padding: 1rem;
  box-shadow: var(--global-box-shadow);
  cursor: pointer;
  transition:
    transform m3-anim.$expressiveSlowSpital,
    background-color m3-anim.$expressiveSlowEffects;
  border: 1px solid var(--pal-outline);
  border-radius: 1rem;
  max-width: 100%;
  width: 100%;

  &:hover {
    transform: scale(1.03) translateY(-1%);
    background-color: var(--pal-primary);
  }

  .footer-license-name {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .footer-license-description {
    display: block;
    font-size: 0.85rem;
    text-align: center;
    opacity: 0.9;
  }

  .footer-license-layer-logo {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .footer-license-logo {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    opacity: 0.4;
    font-size: 5em;
    transform: translate(20%, 20%) rotate(-30deg);
  }
}

.footer-extra {
  font-size: 0.85rem;
  color: var(--pal-onSurfaceVariant);
  text-align: center;
}
</style>
