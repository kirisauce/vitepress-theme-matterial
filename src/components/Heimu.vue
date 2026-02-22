<script setup lang='ts'>
import { Ref, useTemplateRef } from 'vue'

const {
  backgroundColor = 'var(--heimu-background-color, #000)',
  color = 'inherit',
} = defineProps<{
  backgroundColor?: string,
  color?: string,
}>()

const elWrapper: Ref<HTMLElement | null> = useTemplateRef('wrapper')
</script>

<template>
  <span class='heimu' ref='wrapper' @click="elWrapper?.classList.toggle('heimu-show')">
    <slot></slot>
  </span>
</template>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';

.heimu {
  background-color: v-bind(backgroundColor);
  color: v-bind(backgroundColor);
  transition:
    background-color m3-anim.$expressiveDefaultEffects,
    color m3-anim.$expressiveDefaultEffects;
}

.heimu.heimu-show, .heimu:hover {
  color: v-bind(color);
}
</style>