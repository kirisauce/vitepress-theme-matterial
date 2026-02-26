<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useLayoutConfig } from '../composables/layout-config'

const props = $computed(() => useLayoutConfig().value.headerImage!)

// 定义背景图行为模式的枚举
export type BackgroundBehavior = 'fullscreen' | 'static' | 'parallax'

// 响应式数据
const parallaxOffset = ref(0)
const containerRef = ref<HTMLElement | null>(null)

// 计算容器的类名
const containerClass = $computed(() => {
  return [
    'background-image',
    `behavior-${props.behavior}`,
  ]
})
</script>

<template>
  <img @drag.prevent :class='containerClass' :src="props.src" v-if='props' />
</template>

<style lang="scss" scoped>
.background-image {
  overflow: hidden;
  display: block;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
  user-select: none;

  // 全屏背景图模式
  &.behavior-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  // 静态背景图模式
  &.behavior-static {
    position: sticky;
    top: 0;
    flex: 0 0 auto;
    width: 100%;
    height: 100%;
  }

  // 视差背景图模式
  &.behavior-parallax {
    width: 100%;
    // 视差效果通过JavaScript控制transform实现
  }
}
</style>