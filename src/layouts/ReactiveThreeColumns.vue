<script lang='ts' setup>
import { useOrientation } from '../composables/preferences'

const {
  mode = 'normal',
} = defineProps<{
  mode?: 'normal' | 'center-stressed',
}>()

// 使用use函数获取状态
const orientation = useOrientation()
</script>

<template>
  <div class='page-content-wrapper'>
    <!-- Left Cards -->
    <div class='left-cards' v-show='orientation === "landscape"'>
      <slot name="left" />
    </div>

    <!-- Center Cards -->
    <div class='center-cards'>
      <slot name="center" />
    </div>

    <!-- Right Cards -->
    <div :class="{
      [mode === 'center-stressed' ? 'left-cards' : 'right-cards']: true,
    }" v-show='orientation === "landscape"'>
      <slot name="right" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';
@use '../styles/abstract/screen' as *;

.page-content-wrapper {
  flex: 1 0 10em;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;

  box-sizing: border-box;
  padding: 0 5px 0 5px;

  transition: padding m3-anim.$expressiveSlowSpital;

  @include when('landscape') {
    padding: 0 48px;
  }

  @include when('narrow-landscape') {
    padding: 0 8px;
  }

  @include when('portrait') {
    padding: 0 5px;
  }
}

%layout-cards-column {
  position: relative;
  display: block flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  transition: flex m3-anim.$expressiveSlowSpital;
}

.left-cards {
  @extend %layout-cards-column;

  flex: 0 0 0;

  @include when('wide-landscape') {
    flex: 1 10 4em;
  }
}

.center-cards {
  @extend %layout-cards-column;

  flex: 1 0 100px;
  overflow: hidden;

  @include when('landscape') {
    flex: 12 5 10em;
  }
}

.right-cards {
  @extend %layout-cards-column;

  flex: 4 1 10em;
  overflow: visible;

  @include when('portrait') {
    flex: 0 0 0;
  }
}
</style>