<script lang='ts' setup>
import { useData } from 'vitepress';
import { usePreferences } from '../composables/preferences'

import MdiMenu from '~icons/mdi/menu'
import CircleButton from './CircleButton.vue';
import SvgContainer from './SvgContainer.vue';
import MdButton from './MdButton.vue';
import { h } from 'vue';

const emit = defineEmits<{
  (e: 'optionsClick'): void,
}>()

const { orientation } = usePreferences()
const { theme } = useData()

const componentSiteIcon = () => h("span", {
  innerHTML: theme.value.navigator?.siteIcon,
  style: {
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
  },
})
</script>

<style lang='scss' scoped>
@use '../styles/m3-anim';

nav {
  position: sticky;
  top: 0px;

  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 0 0 3em;

  z-index: 100;

  transition: top m3-anim.$expressiveFastSpital;

  @media (orientation: landscape) {
    top: 12px;
  }

  .navigator-container {
    flex: 0 0 100%;

    box-sizing: border-box;
    padding: 8px 1ch 8px 1ch;

    backdrop-filter: blur(10px);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    box-shadow: 0 0 5px 0px var(--pal-shadow);
    background-color: color(from var(--pal-secondaryContainer) srgb r g b / 0.8);
    color: var(--pal-onSecondaryContainer);

    transition:
      flex m3-anim.$standardSlowSpital,
      padding m3-anim.$standardSlowSpital,
      border-radius m3-anim.$expressiveSlowSpital;

    @media (orientation: landscape) {
      flex: 0 0 70%;
      padding-left: 3ch;
      padding-right: 3ch;

      border-radius: 50px;
      // border-bottom-right-radius: 25px;
    }
  }
}

.navigator-container {
  >.site-logo {
    color: inherit;
  }

  >.site-logo:hover {
    font-weight: bolder;
  }

  .menu:hover {
    background-color: var(--pal-secondaryFixedDim);
    color: var(--pal-onSecondaryFixed)
  }

  @media (orientation: portrait) {
    font-size: 1.2em;
  }
}
</style>

<template>
  <nav>
    <div class='navigator-container'>
      <a class='site-logo' href='/'>
        <MdButton :icon='componentSiteIcon' type='text'>
          <Transition name='site-text' :appear='false'>
            <div style='display:inline-block;' v-show='orientation == "landscape"'>
              {{ theme.navigator.siteText }}
            </div>
          </Transition>
        </MdButton>
      </a>

      <div class='links-and-options'>
        <MdButton class='menu' type='tonal' shape='round' @click='emit("optionsClick")'>
          <MdiMenu />
        </MdButton>
      </div>
    </div>
  </nav>
</template>