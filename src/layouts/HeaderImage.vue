<script setup lang="ts">
import { useLayoutConfig } from '../composables/layout-config'

const config = $computed(() => useLayoutConfig().value.headerImage!)

// 定义背景图行为模式的枚举
export type BackgroundBehavior = 'fullscreen' | 'static' | 'parallax'
</script>

<template>
  <div v-if='config' :class="['header-image-container', `behavior-${config.behavior}`]">
    <img @drag.prevent class='header-image' :src="config.src" />
  </div>
</template>

<style lang="scss" scoped>
.header-image-container {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: hidden;

  // 全屏背景图模式
  &.behavior-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }

  // 静态背景图模式
  &.behavior-static {
    flex: 0 0 auto;
    width: 100vw;
    height: 100vh;
    position: sticky;
    top: 0;
  }

  // 视差背景图模式
  &.behavior-parallax {
    flex: 0 0 auto;
    width: 100vw;
    transform: translateZ(-1px) scale(2.25);
    height: 100vh;
  }

  // 半视差背景图
  &.behavior-half-parallax {
    flex: 0 0 auto;
    width: 100vw;
    height: 50vh;
    transform-origin: 50% 100%;
    transform: translateZ(-1px) scale(2.25);
  }
}

.header-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
}
</style>