<script setup lang="ts">
import { useData } from 'vitepress'
import { useLayoutConfig } from '../composables/layout-config'

const site = $(useData().site)
const config = $computed(() => useLayoutConfig().value.headerImage!)
const applyPlaceholders = (s: string | undefined) => {
  if (s === undefined) {
    return undefined
  }
  return s
    .replaceAll('{site_name}', site.title)
    .replaceAll('{site_desc}', site.description)
}
</script>

<template>
  <div v-if='config' :class="['header-image-container', `behavior-${config.behavior}`]">
    <div class='header-image-titles'>
      <h2 style='font-size: 40px;margin: 0;'>{{ applyPlaceholders(config.title) }}</h2>
      <p style='font-size: 20px;'>{{ applyPlaceholders(config.subtitle) }}</p>
    </div>
    <img @drag.prevent class='header-image' :src="config.src" />
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/font';

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

.header-image-titles {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--pal-surface);
}
</style>