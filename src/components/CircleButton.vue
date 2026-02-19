<script lang='ts' setup>
import { computed } from 'vue';
import { usePalette } from '../composables/colorpalette'
import { cssHexFromArgb as hex, cssHexColorWith as hexWith } from '../utils';

const paletteRef = usePalette()
const paletteStyle = computed(() => {
  const palette = paletteRef.value

  return {
    '--pal-shadow': hex(palette.shadow),
    '--pal-bkgr': hex(palette.primary),
    '--pal-color': hex(palette.onPrimary),
    '--pal-bkgrActive': hex(palette.secondary),
    '--pal-colorActive': hex(palette.onSecondary),
    '--pal-bkgrIdle': hexWith(hex(palette.primary), { a: 15 }),
    '--pal-colorIdle': 'inherit',
  }
})
</script>

<style lang='scss' scoped>
@use '@vc/styles/abstract/m3-anim';

.button {
  display: flex;
  box-sizing: border-box;
  border-radius: 2em;
  padding: 0.4em;

  transition:
    background-color m3-anim.$expressiveDefaultEffects,
    box-shadow m3-anim.$expressiveDefaultEffects,
    color m3-anim.$expressiveDefaultEffects;

  background-color: var(--pal-bkgrIdle);
  color: var(--pal-colorIdle);
  border: 1px solid var(--pal-outlineVariant);

  box-shadow: var(--global-box-shadow);
}

.button:hover {
  background-color: var(--pal-bkgr);
  color: var(--pal-color)
}

.button:active {
  background-color: var(--pal-bkgrActive);
  color: var(--pal-colorActive);
  box-shadow: 0 0 5px 0 var(--pal-shadow);
}
</style>

<template>
  <div class='button' :style='paletteStyle'>
    <slot></slot>
  </div>
</template>