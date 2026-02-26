<script setup lang='ts'>
import { h } from 'vue';
import MdButton from '../../components/MdButton.vue'
import { componentFromSvgText as makeSvg } from '../../client-lib/svg-helper'
import { NavButtonConfig } from '../../shared/theme-config'
import { useRouter, withBase } from 'vitepress'

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

const router = useRouter()
const go = () => router.go(withBase(config?.href ?? '/'))
</script>

<template>
  <MdButton :icon='ComponentSiteIcon' type='text' size='xsmall' @click='go'>
    <div style='display:inline-block;' v-if='config?.text'>
      {{ config?.text }}
    </div>
  </MdButton>
</template>