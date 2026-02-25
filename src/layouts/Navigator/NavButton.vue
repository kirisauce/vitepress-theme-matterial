<script setup lang='ts'>
import { h } from 'vue';
import MdButton from '../../components/MdButton.vue'
import { componentFromSvgText as makeSvg } from '../../client-lib/svg-helper'
import { NavButtonConfig } from '../../shared/theme-config'
import { withBase } from 'vitepress';

const { config } = defineProps<{ config?: NavButtonConfig }>()

const ComponentSiteIcon = () => {
  if (!config?.icon) {
    return null
  }

  return h(makeSvg(config?.icon!), {
    style: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
  })
}
</script>

<template>
  <a class='site-logo' :href="withBase(config.href ?? '/')" v-if='config'>
    <MdButton :icon='ComponentSiteIcon' type='text' size='xsmall'>
      <div style='display:inline-block;' v-if='config?.text'>
        {{ config?.text }}
      </div>
    </MdButton>
  </a>
</template>