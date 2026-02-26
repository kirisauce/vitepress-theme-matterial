<script setup lang="ts">
import MdiWhiteBalanceSunny from '~icons/mdi/white-balance-sunny'
import MdiMoonAndStars from '~icons/mdi/moon-and-stars'
import MdiGearOutline from '~icons/mdi/gear-outline'
import MdiSunMoonStars from '~icons/mdi/sun-moon-stars'
import MdiKeyboardArrowDown from '~icons/mdi/keyboard-arrow-down'

import Options from '../../components/Options.vue'
import { usePreferences, UserColorScheme } from '../../composables/preferences'
import { mayStartViewTransition } from '../../client-lib/view-transition'
import { onMounted, onWatcherCleanup, watch } from 'vue'

let colorScheme = $(usePreferences().colorScheme.userColorScheme)

const OPTIONS = [
  {
    id: 'light',
    text: '亮色模式',
    icon: MdiWhiteBalanceSunny,
  },
  {
    id: 'dark',
    text: '暗色模式',
    icon: MdiMoonAndStars,
  },
  {
    id: 'system',
    text: '遵循系统',
    icon: MdiGearOutline,
  },
]

let show = $ref(false)

const handle = (e: PointerEvent) => {
  const el = e.target as HTMLElement
  if (!el.matches('.switch-color *')) {
    show = false
    document.removeEventListener('pointerdown', handle)
  }
}

onMounted(() => {
  watch($$(show), (show) => {
    if (show) {
      document.addEventListener('pointerdown', handle)
      onWatcherCleanup(() => document.removeEventListener('pointerdown', handle))
    }
  })
})

const change = (id: string) => {
  mayStartViewTransition(() => {
    colorScheme = id as UserColorScheme
    show = false
  })
}
</script>

<template>
  <div tabindex='0' class='switch-color' ref='switchColor' @click='show = !show'>
    <MdiSunMoonStars />
    <MdiKeyboardArrowDown />
    <div class='state-layer'></div>
    <Options :display='show' :options='OPTIONS' :selected='colorScheme' @select='change'></Options>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/abstract/m3-anim';

.switch-color {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  overflow: visible;
  font-size: 22px;
  padding: 4px 12px;
  border-radius: 16px;

  &>.state-layer:hover {
    border-color: var(--pal-outline);
  }

  &>.state-layer:active {
    background-color: #ffffff44;
  }
}

.state-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition:
    background-color m3-anim.$expressiveDefaultEffects,
    border m3-anim.$expressiveDefaultEffects;
  ;
  border-radius: 16px;
  border: solid 1px var(--pal-outlineVariant);
}
</style>