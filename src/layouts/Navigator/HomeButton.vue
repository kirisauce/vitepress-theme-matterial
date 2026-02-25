<script setup lang='ts'>
import { h } from 'vue';
import MdButton from '../../components/MdButton.vue'
import { usePreferences } from '../../composables/preferences'
import { componentFromSvgText as makeSvg } from '../../client-lib/svg-helper';
import { useLayoutConfig } from '../../composables/layout-config';

const { orientation } = usePreferences()

const layout = $(useLayoutConfig())

const ComponentSiteIcon = () => {
  const siteIcon = layout.navigator?.siteIcon
  if (!siteIcon) {
    return null
  }

  return h(makeSvg(siteIcon), {
    style: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
  })
}
</script>

<template>
  <a class='site-logo' href='/'>
    <MdButton :icon='ComponentSiteIcon' type='text' size='xsmall'>
      <Transition name='site-text' :appear='false'>
        <div style='display:inline-block;' v-if='orientation == "landscape" && layout.navigator?.siteText'>
          {{ layout.navigator?.siteText }}
        </div>
      </Transition>
    </MdButton>
  </a>
</template>

<style lang="scss" scoped></style>