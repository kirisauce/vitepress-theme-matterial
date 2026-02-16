<script lang='ts' setup>
const {
  noMargin = false,
  style = {},
} = defineProps<{
  noMargin?: boolean,
  style?: Record<string, string>,
}>()
</script>

<style lang='scss'>
.svg-container {
  position: relative;
  display: inline-flex;
  vertical-align: middle;

  >svg {
    display: block;
  }
}
</style>

<template>
  <span class='svg-container' :style='{
    margin: noMargin ? "" : "0 0.2em 0 0.2em",
    ...style,
  }'>
    <slot></slot>
  </span>
</template>