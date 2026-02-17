<script setup lang='ts'>
import { useData } from 'vitepress'
import MdButton from './MdButton.vue'
import { h } from 'vue';
import { usePreferences } from '../composables/preferences'

const { theme } = useData()
const { orientation } = usePreferences()

const componentSiteIcon = () => h('span', {
  innerHTML: theme.value.navigator?.siteIcon,
  style: {
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
  },
})
</script>

<template>
  <a class='site-logo' href='/'>
    <MdButton :icon='componentSiteIcon' type='text'>
      <Transition name='site-text' :appear='false'>
        <div style='display:inline-block;' v-show='orientation == "landscape"'>
          {{ theme.navigator.siteText }}
        </div>
      </Transition>
    </MdButton>
  </a>
</template>

<style lang="scss" scoped></style>