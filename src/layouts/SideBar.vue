<script lang='ts' setup>
import { computed, ref, StyleValue, Teleport, Transition } from 'vue';
import { usePalette } from '../composables/colorpalette';
import { cssHexColorWith, cssHexFromArgb } from '../shared/utils';

defineEmits<{
  (e: 'exit'): void,
  (e: 'afterEnter'): void,
}>()

const palette = usePalette()

const {
  side = 'left',
  width = '20em',
  show = false,
  captureClick = true,
  anim = true,
  appear = false,

  backgroundColor: backgroundColorRaw = undefined,
  color: colorRaw = undefined,

  style = {},
  backgroundStyle = {},
} = defineProps<{
  side?: 'left' | 'right',
  width?: string,
  show?: boolean,

  captureClick?: boolean,

  /**
   * Whether to apply animations when side bar shows and hides.
   */
  anim?: boolean,

  /**
   * Whether to apply transition on first render.
   */
  appear?: boolean,

  /**
   * Style that applies to the actual side bar HTML element.
   */
  style?: StyleValue,

  backgroundStyle?: StyleValue,

  backgroundColor?: string,
  color?: string,
}>()

const barStyle = computed(() => {
  let result = {
    width,
    color: colorRaw ?? cssHexFromArgb(palette.value.onSurfaceVariant),
    'background-color': backgroundColorRaw ?? cssHexColorWith(cssHexFromArgb(palette.value.surfaceContainerHigh), { a: 180 }),
  } as any

  if (side === 'left') {
    Object.assign(result, {
      left: '0',
      right: 'initial',
      'border-top-right-radius': '2em',
      'border-bottom-right-radius': '2em',
    })
  } else {
    Object.assign(result, {
      left: 'initial',
      right: '0',
      'border-top-left-radius': '2em',
      'border-bottom-left-radius': '2em',
    })
  }

  Object.assign(result, style)
  return result
})

const classes = computed(() => {
  return {
    transition: 'side-bar-transition',
    showState: 'side-bar-state-show-' + side,
    hideState: 'side-bar-state-hide-' + side,
  }
})

const showWrapper = ref<boolean>(show)
</script>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';

.side-bar-background {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  opacity: var(--background-opacity);
  background-color: #000000;
  transition: opacity m3-anim.$expressiveDefaultEffects;
}

.side-bar {
  position: fixed;
  top: 0;
  height: 100%;
  z-index: 1100;

  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1em;
  box-shadow: var(--global-box-shadow);
  border-left: 1px solid var(--pal-outlineVariant);

  background-color: color(from var(--side-bar-bkgr) srgb r g b / 0.9);
  color: var(--side-bar-color);
}

$anim: m3-anim.$standardSlowSpital;

.side-bar-transition {
  transition: transform $anim;
}

.side-bar-state-show-left {
  transform: translateX(0);
}

.side-bar-state-hide-left {
  transform: translateX(-100%);
}

.side-bar-state-show-right {
  transform: translateX(0);
}

.side-bar-state-hide-right {
  transform: translateX(100%);
}

.background-enter-active,
.background-leave-active {
  transition: opacity m3-anim.$expressiveSlowEffects;
}

.background-enter-from,
.background-leave-to {
  opacity: 0;
}

.background-enter-to,
.background-leave-from {
  opacity: var(--background-opacity);
}
</style>

<template>
  <Teleport defer to='.super-page-container'>
    <span style='position: absolute'>
      <Transition name='background'>
        <div class='side-bar-background' @click='$emit("exit")' v-show='show && captureClick'
          :style='[backgroundStyle, `--background-opacity: ${captureClick ? 0.45 : 0.15}`]'>
        </div>
      </Transition>
      <Transition name='side-bar' :appear='appear' :css='anim' :enter-active-class='classes.transition'
        :leave-active-class='classes.transition' :leave-from-class='classes.showState'
        :enter-to-class='classes.showState' :leave-to-class='classes.hideState' :enter-from-class='classes.hideState'
        @before-enter='showWrapper = true' @after-leave='showWrapper = false' @after-enter='$emit("afterEnter")'>
        <div class='side-bar' :style='barStyle' v-show='show'>
          <slot></slot>
        </div>
      </Transition>
    </span>
  </Teleport>
</template>