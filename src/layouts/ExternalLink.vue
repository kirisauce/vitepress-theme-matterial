<script setup lang="ts">
import { useData } from 'vitepress';
import { ExternalSite, ExternalSiteIconDisplay, ThemeConfig } from '../shared';
import { componentFromSvgText } from '../client-lib/svg-helper';

const { theme } = useData<ThemeConfig>()

const getExternalSite = (siteName: string): ExternalSite => {
  return {
    ...theme.value.externalSites?.default!,
    ...theme.value.externalSites?.[siteName],
  }
}

const {
  siteName,
  link,
  target = '_blank',
  display: propDisplay,
} = defineProps<{
  siteName: string,
  link: string,
  target?: string,
  display?: ExternalSiteIconDisplay,
}>()

const linkSite = $computed(() => getExternalSite(siteName))
const display = $computed(() => propDisplay ?? linkSite.display)
</script>

<template>
  <a :href="link" :target='target' class='external-link' :title='`Link to ${linkSite?.displayName}`'>
    <component v-if="display !== 'name'" :is='componentFromSvgText(linkSite.icon!)' />
    <span v-if='display !== "icon"'>{{ linkSite.displayName }}</span>
  </a>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/m3-anim';

.external-link {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  background: transparent;
  text-decoration: none;
  color: var(--pal-primary);
  font-size: 1rem;
  transition:
    border m3-anim.$expressiveDefaultEffects,
    transform m3-anim.$expressiveDefaultSpital,
    opacity m3-anim.$expressiveDefaultEffects;
  padding: 6px; // 增加内边距
  opacity: 0.67;

  border: solid 1px #00000000;
  border-radius: 1lh;

  &>svg {
    font-size: 1.5rem;
  }

  &:hover {
    opacity: 1;
    border: 1px solid var(--pal-outlineVariant);
    transform: translateY(-1px);
  }
}
</style>