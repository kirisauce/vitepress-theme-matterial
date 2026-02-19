<script lang='ts' setup>
import { computed, FunctionalComponent, useTemplateRef } from 'vue'
import { c, usePalette } from '../composables/colorpalette'
import { objectPropertiesAddPrefix } from '../utils'

const paletteRef = usePalette()

const localPal = computed(() => {
  const pal = paletteRef.value
  return objectPropertiesAddPrefix('--lpal-', {
    disabledContainer: c(pal.onSurface).withmod({ a: 26 }).css,
    disabledLabel: c(pal.onSurface).withmod({ a: 100 }).css,
  })
})

const el = useTemplateRef('button')

const {
  type = 'elevated',
  size = 'small',
  shape = 'square',
  icon = undefined,
  disabled = false,
  selected = undefined,
  autoBlur = 'pre',
} = defineProps<{
  type?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text',
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge',
  shape?: 'round' | 'square',
  icon?: string | FunctionalComponent,
  disabled?: boolean,
  selected?: boolean,
  autoBlur?: 'pre' | 'post' | 'none',
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void,
}>()

const handleClick = (event: MouseEvent) => {
  if (autoBlur === 'pre') {
    el.value?.blur()
  }

  emit('click', event)

  if (autoBlur === 'post') {
    el.value?.blur()
  }
}

const classes = computed(() => [
  size,
  shape,
  type,
].concat(selected === undefined ? [] as any : [selected ? 'selected' : 'unselected']))
</script>

<style scoped lang='scss'>
@use '@vc/styles/abstract/m3-anim';
@use '@vc/styles/abstract/m3-vars';
@forward '@vc/styles/component/button-types';

button {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 0 6px -3px var(--pal-shadow);
  border-color: transparent;

  transition:
    color m3-anim.$standardDefaultEffects,
    background-color m3-anim.$standardDefaultEffects,
    border-radius m3-anim.$standardFastSpital;

  >:not(.state-layer) {
    z-index: 10;
  }
}

// ---------- Size Classes ----------

// --- extra small ---

.xsmall {
  height: 32px;
  border-width: 1px;
  border-style: solid;
  font-weight: m3-vars.$weight-medium;
  font-size: 14pt;
  line-height: 20pt;
  gap: 8px;
  padding: 0 12px 0 12px;
  --icon-size: 20px;
}

.xsmall.square {
  border-radius: m3-vars.$corner-medium;
}

.xsmall.round {
  border-radius: 20px;
}

.xsmall:enabled:active {
  border-radius: m3-vars.$corner-small;
}

// --- small ---

.small {
  height: 40px;
  border-width: 1px;
  border-style: solid;
  font-weight: m3-vars.$weight-medium;
  font-size: 14pt;
  line-height: 20pt;
  gap: 8px;
  padding: 0 16px 0 16px;
  --icon-size: 20px;
}

.small.square {
  border-radius: m3-vars.$corner-medium;
}

.small.round {
  border-radius: 20px;
}

.small:enabled:active {
  border-radius: m3-vars.$corner-small;
}

// --- medium ---

.medium {
  height: 56px;
  border-width: 1px;
  border-style: solid;
  font-weight: m3-vars.$weight-medium;
  font-size: 16pt;
  line-height: 24pt;
  gap: 8px;
  padding: 0 24px 0 24px;
  --icon-size: 24px;
}

.medium.square {
  border-radius: m3-vars.$corner-large;
}

.medium.round {
  border-radius: 28px;
}

.medium:enabled:active {
  border-radius: m3-vars.$corner-medium;
}

// --- large ---

.large {
  height: 96px;
  border-width: 2px;
  border-style: solid;
  font-weight: m3-vars.$weight-regular;
  font-size: 24pt;
  line-height: 32pt;
  gap: 12px;
  padding: 0 48px 0 48px;
  --icon-size: 32px;
}

.large.square {
  border-radius: m3-vars.$corner-xlarge;
}

.large.round {
  border-radius: 48px;
}

.large:enabled:active {
  border-radius: m3-vars.$corner-large;
}

// --- extra large ---

.xlarge {
  height: 136px;
  border-width: 3px;
  border-style: solid;
  font-weight: m3-vars.$weight-regular;
  font-size: 32pt;
  line-height: 40pt;
  gap: 16px;
  padding: 0 64px 0 64px;
  --icon-size: 40px;
}

.xlarge.square {
  border-radius: m3-vars.$corner-xlarge;
}

.xlarge.round {
  border-radius: 48px;
}

.xlarge:enabled:active {
  border-radius: m3-vars.$corner-large;
}
</style>

<template>
  <button ref='button' :disabled='disabled' :class='classes' :style='localPal' @click='handleClick'>
    <component v-if='icon' :is='icon' />
    <slot></slot>
    <div class='state-layer'></div>
  </button>
</template>