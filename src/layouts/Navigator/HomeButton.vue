<script setup lang='ts'>
import { useData } from 'vitepress'
import { h } from 'vue';
import MdButton from '../../components/MdButton.vue'
import { usePreferences } from '../../composables/preferences'
import { componentFromSvgText as makeSvg } from '../../client-lib/svg-helper';
import { ThemeConfig } from '../../shared';

const { theme } = useData<ThemeConfig>()
const { orientation } = usePreferences()

const ComponentSiteIcon = () => {
  const siteIcon = theme.value?.layout?.navigator?.siteIcon
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
    <MdButton :icon='ComponentSiteIcon' type='text'>
      <Transition name='site-text' :appear='false'>
        <div style='display:inline-block;' v-if='orientation == "landscape" && theme?.layout?.navigator?.siteText'>
          {{ theme.layout?.navigator?.siteText }}
        </div>
      </Transition>
    </MdButton>
  </a>
</template>

<style lang="scss" scoped></style>