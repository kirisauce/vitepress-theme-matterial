<script setup lang='ts'>
import { useTemplateRef, ref, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { useToc, extractCatalogFromDom } from '@vc/composables/toc'
import { useGlobalElements } from '@vc/composables/global-elements'
import { ThemeConfig } from '@vc/shared'
import * as patches from '@vc/pages/content-patches'

// Components
import PostHeader from '@vc/layouts/Post/Header.vue'
import PostFooter from '@vc/layouts/Post/Footer.vue'
import SvgContainer from '@vc/components/SvgContainer.vue'
import SideBar from '@vc/layouts/SideBar.vue'
import CircleButton from '@vc/components/CircleButton.vue'
import Navigator from '@vc/layouts/Navigator.vue'
import NavigatorHomeButton from '@vc/layouts/Navigator/HomeButton.vue'
import Toc from '@vc/components/Toc.vue'
import MdButton from '@vc/components/MdButton.vue'
import ReactiveThreeColumns from '@vc/layouts/ReactiveThreeColumns.vue'

// Icons
import MdiTableOfContents from '~icons/mdi/table-of-contents'
import MdiArrowBack from '~icons/mdi/arrow-back'
import MdiClose from '~icons/mdi/close'
import MdiMenu from '~icons/mdi/menu'

// @ts-ignore
import cardStyle from '@vc/styles/layout/card.module.scss'

// Vitepress Data
const { frontmatter } = useData<ThemeConfig>()

// 使用use函数获取状态
const { items: tocItems, activeId: activeTitleId } = useToc()

// 定义模板引用
const elContent = useTemplateRef('elContent')
const elTocCard = useTemplateRef('elTocCard')
const elToc = useTemplateRef('elToc')
const elSideBarToc = useTemplateRef('elSideBarToc')

const { page: elPage } = useGlobalElements()!

// 观察器引用
const scrollHandler = ref<(() => void) | null>(null)

const showSideBar = ref<boolean>(false)

// 更新TOC内容
const updateTocContent = () => {
  if (elContent.value) {
    tocItems.value = extractCatalogFromDom(elContent.value)
    patches.patchAnchors(elContent.value)
  }
}

// 设置滚动监听
const setupScrollListener = () => {
  if (elPage.value && !scrollHandler.value) {
    scrollHandler.value = () => {
      updateActiveTitle()
    }
    elPage.value.addEventListener('scroll', scrollHandler.value)
  }
}

// 移除滚动监听
const removeScrollListener = () => {
  if (elPage.value && scrollHandler.value) {
    elPage.value.removeEventListener('scroll', scrollHandler.value)
    scrollHandler.value = null
  }
}

// 更新活动标题
const updateActiveTitle = () => {
  if (tocItems.value.length === 0) return

  for (const item of tocItems.value) {
    const rect = item.targetElement.getBoundingClientRect()
    if (rect.top > 100) {
      activeTitleId.value = item.id
      return
    }
  }
  // 如果没有找到合适的标题，设置为最后一个
  activeTitleId.value = tocItems.value[tocItems.value.length - 1]?.id
}

// 目录跳转
const catalogJumpTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    history.pushState(null, '', `#${id}`)
    elPage.value?.scrollTo({
      left: 0,
      top: el.offsetTop,
      behavior: "smooth",
    })
  }
}

const openSideBar = () => {
  showSideBar.value = true
}

const closeSideBar = () => {
  showSideBar.value = false
}

// 内容挂载后的回调
const onContentMounted = () => {
  if (elContent.value) {
    // 初始化TOC
    updateTocContent()
    setTimeout(updateActiveTitle, 250)

    // 设置滚动监听
    setupScrollListener()
  }
}

// 组件卸载时清理
onUnmounted(() => {
  removeScrollListener()
})
</script>

<template>
  <Navigator>
    <NavigatorHomeButton />
    <MdButton @click='openSideBar' type='tonal' shape='round'>
      <MdiMenu />
    </MdButton>
  </Navigator>

  <!-- 侧边栏 -->
  <SideBar :show='showSideBar' side='right' @after-enter='elSideBarToc?.updateIndicator()' @exit='closeSideBar'
    style='backdrop-filter: blur(15px); gap: 0.75em;'>
    <div class='side-bar-header'>
      <!-- Back Button -->
      <div style='display:flex; flex-direction: row; align-items: center; gap: 1em;'>
        <CircleButton @click='console.log("sb")'>
          <MdiArrowBack height='2em' width='2em' />
        </CircleButton>
        <div class='toc-text' style='font-size:1.5em;'>目录</div>
      </div>

      <!-- Close Button -->
      <CircleButton @click='closeSideBar'>
        <MdiClose height='2em' width='2em' />
      </CircleButton>
    </div>
    <Toc @click='(item) => catalogJumpTo(item.id!)'
      style='flex:1; border:1px solid var(--pal-outline); border-radius:1em; box-shadow:var(--global-box-shadow);'
      ref='elSideBarToc' />
    <div></div>
  </SideBar>

  <ReactiveThreeColumns>
    <template #center>
      <main :class="['layout-card', cardStyle['card-content']]">
        <span>
          <!-- Header Information -->
          <PostHeader />
          <hr class='sep01' />

          <!-- Real Post Content -->
          <span class='post-content' ref='elContent' @vue:mounted='onContentMounted'>
            <Content />
          </span>

          <!-- Footer -->
          <hr class='sep01' />
          <PostFooter />
        </span>
      </main>
    </template>

    <template #right>
      <div :class="[cardStyle['card-toc']]" ref='elTocCard'>
        <div class='toc-text'>
          <SvgContainer>
            <MdiTableOfContents />
          </SvgContainer>目录
        </div>

        <Toc @click='(item) => catalogJumpTo(item.id!)' ref='elToc' ulStyle='overflow:auto;' style='flex: 1 0 0;' />
      </div>
    </template>
  </ReactiveThreeColumns>
</template>

<style lang='scss' scoped>
@use '@vc/styles/layout/post/title';
@use '@vc/styles/ext/vp-header-anchor';

.sep01 {
  margin-top: 25px;
  margin-bottom: 25px;
  mix-blend-mode: soft-light;
}

.post-content {
  @include title.apply-style;
  @include title.apply-decoration;

  :deep(.header-anchor) {
    @include vp-header-anchor.apply;
  }
}

.side-bar-header {
  display: flex;
  flex: 0 0 2em;
  flex-direction: row;
  justify-content: space-between;
}
</style>