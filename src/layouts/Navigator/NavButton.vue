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
const href = $computed(() => withBase(config?.href ?? '/'))
const go = () => router.go(href)
</script>

<template>
  <a :href='href' @click.prevent>
    <MdButton tabindex='-1' :icon='ComponentSiteIcon' type='text' size='xsmall' @click='go' class='nav-button'>
      <div style='display:inline-block;' v-if='config?.text'>
        {{ config?.text }}
      </div>
    </MdButton>
  </a>
</template>

<style lang="scss" scoped>
@use '../../styles/abstract/m3-vars';

.nav-button {
  box-shadow: 0 0 0;
}
</style>