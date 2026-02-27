<script lang="ts" setup>
const {
  gap = '12px',
  rowGap = '12px',
  minColumnWidth = '250px'
} = defineProps<{
  /** 列之间的间距 */
  gap?: string,
  /** 行间距 */
  rowGap?: string,
  /** 最小列宽 */
  minColumnWidth?: string
}>()
</script>

<template>
  <div class="flow-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.flow-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: v-bind("gap");
  row-gap: v-bind("rowGap");
  align-items: center;
}

.flow-container>* {
  max-width: 50%;
  flex: 1 0 v-bind("minColumnWidth");
}
</style>
