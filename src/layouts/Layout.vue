<script setup lang='ts'>
import { onContentUpdated, useData } from 'vitepress'
import { computed, h, onMounted, provide, ref, useTemplateRef, watch } from 'vue'
import { argbFromHex, Hct, SchemeVibrant } from '@material/material-color-utilities'
import { createPaletteStyle, createPaletteStyleExt, PALETTE_KEY } from '../composables/colorpalette'
import { initColorScheme, initOrientation } from '../composables/preferences'
import { extractCatalogFromDom, initToc } from '../composables/toc'
import { ThemeConfig } from '../shared'
import * as patches from './content-patches'
import Home from './Home.vue'
import SideBar from '../components/SideBar.vue'
import CircleButton from '../components/CircleButton.vue'
import SvgContainer from '../components/SvgContainer.vue'
import Navigator from '../components/Navigator.vue'
import Toc from '../components/Toc.vue'

// Self-hosted font
import "@fontsource/cascadia-code"

// Icons
import MdiArrowBack from '~icons/mdi/arrow-back'
import MdiClose from '~icons/mdi/close'
import MdiTableOfContents from '~icons/mdi/table-of-contents'
import PostHeader from '../components/PostHeader.vue'
import PostFooter from '../components/PostFooter.vue'
import { initThemeRouter } from '../composables/theme-router'
import MdButton from '../components/MdButton.vue'

// ---------- Initialize Composable States ----------

// User theme monitoring
const colorSchemeData = initColorScheme()
const { colorScheme } = colorSchemeData

// Orientation monitoring
const orientation = initOrientation()

// ThemeRouter
const themeRouter = initThemeRouter()

// Vitepress Data
const {
  site,
  frontmatter,
  page,
  theme,
} = useData<ThemeConfig>()

// Table of content
const {
  items: tocItems,
  activeId: activeTitleId,
} = initToc()

// Setting up the palette
const palette = computed(() => new SchemeVibrant(Hct.fromInt(argbFromHex('#66ccff')), colorScheme.value === 'dark', 0) as any)
const paletteStyle = computed(() => {
  const p = palette.value
  const paletteStyle = createPaletteStyle(p)
  const paletteExt = createPaletteStyleExt(p, colorScheme.value === 'dark')
  return Object.assign(paletteStyle, paletteExt)
})
provide(PALETTE_KEY, palette)

// ---------- Define Reactive Values And Element References ----------

const elPage = useTemplateRef('elPage')
const elContent = useTemplateRef('elContent')
const elTocCard = useTemplateRef('elTocCard')
const elToc = useTemplateRef('elToc')
const elSideBarToc = useTemplateRef('elSideBarToc')

const showSideBar = ref<boolean>(false)

// ---------- Utility Functions ----------

const catalogJumpTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    history.pushState(null, '', `#${id}`)
    elPage.value.scrollTo({
      left: 0,
      top: el.offsetTop,
      behavior: "smooth",
    })
  }
}

const updateActiveTitle = () => {
  for (const item of tocItems.value) {
    const rect = item.targetElement.getBoundingClientRect()
    if (rect.top > 100) {
      activeTitleId.value = item.id
      return
    }
  }
  activeTitleId.value = undefined
}

// ---------- First-Time Initializations ----------

onMounted(() => {
  const observer = new ResizeObserver(() => elToc.value.updateIndicator(activeTitleId.value))
  observer.observe(elTocCard.value)
})

onContentUpdated(() => {
  if ('home' !== frontmatter.value.layout) {
    const content = elContent.value
    setTimeout(() => updateActiveTitle(), 500);

    patches.patchAnchors(content)
    tocItems.value = extractCatalogFromDom(content)
  }
})

// ---------- Watching... ----------

watch(showSideBar, () => elToc)

// ---------- Computed Values ----------

const globalClassList = computed(() => {
  let output = {
    'page-container': true,
  }
  output[`color-scheme-${colorScheme.value}`] = true
  return output
})

const globalStyle = computed(() => {
  return {
    '--global-box-shadow': '0 0 5px -2px var(--pal-shadow)',
    ...paletteStyle.value,
  }
})

// ---------- Event Handlers ----------

const onMenuOpen = () => {
  showSideBar.value = true
}
</script>

<style lang='scss'>
@use 'styles/m3-anim';
@forward "./styles/page-code-block.scss";
@forward "./styles/page-markdown-ext.scss";
@forward "./styles/post-title.scss";

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

.sep01 {
  margin-top: 25px;
  margin-bottom: 25px;
  mix-blend-mode: soft-light;
}
</style>

<template>
  <div :class='globalClassList' :style='globalStyle' ref='elPage' @scroll='updateActiveTitle'>
    <!--| Top-level Components |-->

    <SideBar :show='showSideBar' side='right' @exit='showSideBar = false'
      style='backdrop-filter: blur(15px); gap: 0.75em;' @after-enter='elSideBarToc.updateIndicator(activeTitleId)'>
      <div class='side-bar-header'>
        <!-- Back Button -->
        <div style='display:flex; flex-direction: row; align-items: center; gap: 1em;'>
          <CircleButton @click='console.log("sb")'>
            <MdiArrowBack height='2em' width='2em' />
          </CircleButton>
          <div class='toc-text' style='font-size:1.5em;'>目录</div>
        </div>

        <!-- Close Button -->
        <CircleButton @click='showSideBar = false'>
          <MdiClose height='2em' width='2em' />
        </CircleButton>
      </div>
      <Toc @click='(item) => catalogJumpTo(item.id)'
        style='flex:1; border:1px solid var(--pal-outline); border-radius:1em; box-shadow:var(--global-box-shadow);'
        ref='elSideBarToc' />

      <div></div>
    </SideBar>

    <!--| Layout-Managed Components |-->

    <Navigator @options-click='onMenuOpen' />

    <div class='content-wrapper svg-patch'>
      <!-- Left Cards -->
      <div class='layout-cards-column left-cards' v-show='orientation === "landscape"'></div>

      <!-- Center Cards -->
      <div class='layout-cards-column center-cards'>
        <main class='layout-card card-content'>
          <Home v-if='"home" === frontmatter.layout'></Home>
          <span v-else>
            <!-- Header Information -->
            <PostHeader />
            <hr class='sep01' />

            <!-- Real Post Content -->
            <span class='post-content' ref='elContent'>
              <Content />
            </span>

            <!-- Footer -->
            <hr class='sep01' />
            <PostFooter />
          </span>
        </main>
      </div>

      <!-- Right Cards -->
      <div class='layout-cards-column right-cards' v-show='orientation === "landscape"'>
        <div class='layout-card card-toc' v-show='"home" !== frontmatter.layout' ref='elTocCard'>
          <div class='toc-text'>
            <SvgContainer>
              <MdiTableOfContents />
            </SvgContainer>目录
          </div>

          <Toc @click='(item) => catalogJumpTo(item.id)' ref='elToc' ulStyle='overflow:auto;' style='flex: 1 0 0;' />
        </div>
      </div>
    </div>
  </div>
</template>
