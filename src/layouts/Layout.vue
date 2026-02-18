<script setup lang='ts'>
import { useData } from 'vitepress'
import { computed, provide, useTemplateRef } from 'vue'
import { argbFromHex, Hct, SchemeVibrant } from '@material/material-color-utilities'
import { createPaletteStyle, createPaletteStyleExt, PALETTE_KEY } from '../composables/colorpalette'
import { initColorScheme, initOrientation } from '../composables/preferences'
import { initToc } from '../composables/toc'
import { ThemeConfig } from '../shared'
import Home from './Home.vue'
import Post from './Post.vue'

// @ts-ignore Self-hosted font
import "@fontsource/cascadia-code"

// Icons
import { initThemeRouter } from '../composables/theme-router'
import { initGlobalElements } from '../composables/global-elements'

// ---------- Initialize Composable States ----------

// User theme monitoring
const colorSchemeData = initColorScheme()
const { colorScheme } = colorSchemeData

// ThemeRouter
initThemeRouter()

// Orientation monitoring
initOrientation()

// Vitepress Data
const {
  site,
  frontmatter,
  page,
  theme,
} = useData<ThemeConfig>()

// Table of content
const tocData = initToc()

// Global Elements
initGlobalElements({
  page: useTemplateRef('elPage'),
})

// Setting up the palette
const palette = computed(() => new SchemeVibrant(Hct.fromInt(argbFromHex('#66ccff')), colorScheme.value === 'dark', 0) as any)
const paletteStyle = computed(() => {
  const p = palette.value
  const paletteStyle = createPaletteStyle(p)
  const paletteExt = createPaletteStyleExt(p, colorScheme.value === 'dark')
  return Object.assign(paletteStyle, paletteExt)
})
provide(PALETTE_KEY, palette)

// ---------- Computed Values ----------

const globalClassList = computed(() => {
  let output = {
    'page-container': true,
  } as any
  output[`color-scheme-${colorScheme.value}`] = true
  return output
})

const globalStyle = computed(() => {
  return {
    '--global-box-shadow': '0 0 5px -2px var(--pal-shadow)',
    ...paletteStyle.value,
  }
})
</script>

<style lang='scss'>
@use 'styles/m3-anim';

.sep01 {
  margin-top: 25px;
  margin-bottom: 25px;
  mix-blend-mode: soft-light;
}

html {
  overflow: visible;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'LXGW WenKai GB Screen';

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}

.page-container {
  a {
    text-decoration: none;
    color: var(--pal-onBackground);
  }
}

.site-text-leave-active,
.site-text-enter-active {
  transition: transform m3-anim.$expressiveDefaultSpital;
}

.site-text-leave-to,
.site-text-enter-from {
  transform: translate(-5vw, -10vw);
}

.site-text-leave-from,
.site-text-enter-to {
  transform: translate(0, 0);
}
</style>

<style lang='scss' scoped>
@forward './styles/page-layout.scss';
@forward '../styles/cards.scss';
</style>

<template>
  <div :class='globalClassList' :style='globalStyle' ref='elPage'>
    <!--| Layout-Managed Components |-->

    <!-- 文章页面布局 -->
    <Home v-if='frontmatter.layout === "home"' />
    <Post v-else />
  </div>
</template>
