<script setup lang='ts'>
import { useData } from 'vitepress'
import { computed, provide, unref, useTemplateRef, watch } from 'vue'
import { argbFromHex, Hct, SchemeVibrant } from '@material/material-color-utilities'
import { createPaletteStyle, createPaletteStyleExt, PALETTE_KEY } from '../composables/colorpalette'
import { initColorScheme, initOrientation } from '../composables/preferences'
import { initToc } from '../composables/toc'
import { ThemeConfig } from '../shared'
import { provideLayoutConfigLayer, useLayoutConfig } from '../composables/layout-config'
import { LayoutConfig } from '../shared/theme-config'
import Home from './Home.vue'
import Post from './Post.vue'
import PageFooter from '../layouts/PageFooter.vue'
import Archive from './Archive.vue'
import Navigator from '../layouts/Navigator.vue'
import BackgroundImage from '../layouts/HeaderImage.vue'

// Icons
import { initThemeRouter } from '../composables/theme-router'
import { initGlobalElements } from '../composables/global-elements'
import { mergeObjectRecursive } from '../shared/utils'
import { initWeakRefs, Keys } from '../composables/weakrefs'

// ---------- Initialize Composable States ----------

const colorSchemeData = initColorScheme()
initThemeRouter()
initOrientation()
const weakrefs = initWeakRefs()

const { colorScheme } = colorSchemeData

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

let layoutLayer = $ref({} as LayoutConfig)
provideLayoutConfigLayer($$(layoutLayer))
watch(() => [frontmatter.value.layout, frontmatter.value.layoutConfig], ([layout, layoutConfig]) => {
  const layers = []

  if (typeof layout === 'string') {
    layers.push((unref(theme).page as any)?.[layout ?? 'post']?.layout ?? {})
  }

  if (typeof layoutConfig === 'object') {
    layers.push(layoutConfig)
  }

  layoutLayer = mergeObjectRecursive(...layers)
}, { immediate: true })

// ---------- Computed Values ----------

const globalClassList = computed(() => {
  return {
    'page-container': true,
    [`color-scheme-${colorScheme.value}`]: true,
  }
})

const globalStyle = computed(() => {
  return {
    '--global-box-shadow': '0 0 5px -2px var(--pal-shadow)',
    '--global-font-default': theme.value.font?.default!,
    '--global-font-monospace': theme.value.font?.monospace!,
    ...paletteStyle.value,
  }
})

const layout = $(useLayoutConfig(layoutLayer))

const subcontainerBackground = () => {
  if (layout.background) {
    return layout.background
  }

  const behavior = layout.headerImage?.behavior
  if (behavior === 'static') {
    return 'var(--palext-surfaceTransparent)'
  } else if (['parallax', 'half-parallax'].includes(behavior ?? '')) {
    return 'var(--pal-surface)'
  } else {
    return 'transparent'
  }
}
void subcontainerBackground

const navigatorClickHandler = (name: string) => {
  const handler = weakrefs.get(Keys.NAVIGATOR_CLICK_HANDLER) as (typeof navigatorClickHandler) | undefined

  if (handler) {
    handler(name)
  }
}
</script>

<style lang='scss'>
@use '../styles/abstract/m3-anim';

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
@use '../styles/abstract/m3-anim';
@use '../styles/abstract/m3-vars';
@use '../styles/ext/vp-custom-block';
@use '../styles/ext/vp-code-block';

.page-container {
  position: absolute;

  box-sizing: border-box;
  padding: 0;
  transition: padding m3-anim.$expressiveFastSpital;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  overflow-y: auto;
  overflow-x: hidden;

  left: 0;
  top: 0;

  background: var(--pal-surface);
  color: var(--pal-onSurface);

  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 1px;

  // @media (orientation: landscape) {
  //   padding-top: 10px;
  // }

  // 代码块样式
  @include vp-code-block.apply-all;

  &.color-scheme-dark :deep(pre.shiki) {
    @include vp-code-block.shiki-color-scheme(dark);
  }

  &.color-scheme-light :deep(pre.shiki) {
    @include vp-code-block.shiki-color-scheme(light);
  }

  // 自定义块样式
  :deep(.custom-block) {
    @include vp-custom-block.apply;
  }

  :deep(.layout-card) {
    box-shadow: 0 0 m3-vars.$shadow-light;
    background-color: color(from var(--pal-surfaceContainer) srgb r g b / 0.7);
    color: var(--pal-onSurface);
  }
}

.page-subcontainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
  padding: 50px 0;

  transform-style: flat;
  transform: translateZ(0);

  border-top-left-radius: m3-vars.$corner-large;
  border-top-right-radius: m3-vars.$corner-large;

  box-shadow: 0 -4px 4px -4px var(--pal-shadow);

  background-color: v-bind(subcontainerBackground());
}
</style>

<template>
  <div :class='globalClassList' :style='globalStyle' ref='elPage'>
    <!--| Layout-Managed Components |-->
    <BackgroundImage style='z-index:0'></BackgroundImage>

    <div class='page-subcontainer'>
      <Navigator @click='navigatorClickHandler'></Navigator>

      <!-- 文章页面布局 -->
      <Home v-if='frontmatter.layout === "home"' />
      <Archive v-else-if='frontmatter.layout === "archive"' /> <!-- 新增 Archive 组件条件渲染 -->
      <Post v-else />
    </div>

    <!-- 页面页脚 -->
    <PageFooter style='z-index: 101' />
  </div>
</template>
