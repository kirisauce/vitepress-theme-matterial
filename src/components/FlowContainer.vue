<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  /** 列数 */
  columns?: number,
  /** 列之间的间距 */
  gap?: string,
  /** 最小列宽 */
  minColumnWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  gap: '1rem',
  minColumnWidth: '100'
})

// 响应式列数
const currentColumns = ref(props.columns)

// 使用 ResizeObserver 监听容器宽度变化
const containerRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const updateColumns = () => {
  if (!containerRef.value) return
  
  const containerWidth = containerRef.value.offsetWidth
  const minWidth = parseInt(props.minColumnWidth)
  const gap = parseInt(props.gap)
  
  // 计算可以容纳的列数
  const availableColumns = Math.floor((containerWidth + gap) / (minWidth + gap))
  currentColumns.value = Math.max(1, Math.min(availableColumns, props.columns))
}

onMounted(() => {
  updateColumns()
  
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateColumns()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div 
    ref="containerRef" 
    class="flow-container"
    :style="{
      '--columns': currentColumns,
      '--gap': gap
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.flow-container {
  width: 100%;
  column-count: var(--columns);
  column-gap: var(--gap);
  
  // 防止卡片被分割到两列
  :deep(.flow-item) {
    break-inside: avoid;
    margin-bottom: var(--gap);
  }
}
</style>
