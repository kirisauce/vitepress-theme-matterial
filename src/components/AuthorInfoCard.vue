<script lang="ts" setup>
import { useData } from 'vitepress';
import { AuthorInfo, ExternalSite, ThemeConfig } from '../shared/theme'
import { componentFromSvgText } from '../shared/svg-helper';

interface Props {
  author: AuthorInfo & { name: string } | null,
}

defineProps<Props>()

const { theme } = useData<ThemeConfig>()

const getExternalSite = (siteName: string): ExternalSite => {
  return {
    ...theme.value.externalSites?.default!,
    ...theme.value.externalSites?.[siteName],
  }
}

const makeSiteIterator = (externalLinks: Record<string, string>): [string, ExternalSite, string][] => {
  return Object.entries(externalLinks).map(([name, url]) => [name, getExternalSite(name), url])
}
</script>

<template>
  <div class='card-author layout-card' v-if="author">
    <div class="author-info">
      <div class="author-avatar" v-if="author?.avatar">
        <img :src="author!.avatar" alt="Author Avatar" />
      </div>

      <div class="author-details">
        <h3 class="author-name" v-if="author?.name">{{ author?.name }}</h3>
        <div class="author-bio" v-if="author?.bio" v-text='author?.bio?.trim()'></div>
      </div>
    </div>
    
    <div class="author-external-links" v-if="author?.externalLinks">
      <a v-for="[name, site, link] in makeSiteIterator(author.externalLinks)" :key="name" :href="link"
        target='_blank' class='external-link' :title='`Link to ${site?.displayName!}`'>
        <span v-if='site.display === "name"'>{{ site.displayName! }}</span>
        <component v-else :is='componentFromSvgText(site.icon!)' />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@vc/styles/abstract/m3-anim';

.card-author {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;

  min-height: 50px;
  margin: 10px; // 与card-toc保持相同外边距
  padding: 1em;
  box-sizing: border-box;

  background-color: color(from var(--pal-surfaceContainer) srgb r g b / 0.7);
  color: var(--pal-onSurface);
  border-radius: 20px; // 与card-toc保持相同圆角

  .author-info {
    display: flex;
    flex-direction: row; // 固定为横向布局
    align-items: flex-start;
    text-align: left;

    .author-avatar {
      width: auto;
      margin-right: 1rem;
      
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--pal-outlineVariant);
      }
    }

    .author-details {
      flex: 1;
      width: calc(100% - 90px); // 头像宽度+间距

      .author-name {
        font-size: 2rem; // 增大字体大小
        font-weight: 500;
        color: var(--pal-onSurface);
        margin: 0 0 0.5rem 0;
        line-height: 1.3;
      }

      .author-bio {
        font-size: 0.9rem;
        color: var(--pal-onSurfaceVariant);
        line-height: 1.5;
        margin: 0;
        white-space: pre-wrap;
      }
    }
  }

  .author-external-links {
    display: flex;
    flex-direction: row;
    gap: 8px; // 增加间距
    margin-top: 8px;
    margin-left: 1rem;  // 添加左边距以与作者信息对齐
    margin-right: 1rem; // 添加右边距以与作者信息对齐

    border-top: solid 1px var(--pal-outlineVariant);
    padding-top: 8px;

    .external-link {
      display: flex;

      background: transparent;
      border-radius: 4px;
      text-decoration: none;
      color: var(--pal-primary);
      font-size: 0.85rem;
      transition:
        border m3-anim.$expressiveDefaultEffects,
        transform m3-anim.$expressiveDefaultSpital,
        opacity m3-anim.$expressiveDefaultEffects;
      padding: 6px; // 增加内边距
      opacity: 0.67;

      border: solid 1px #00000000;
      border-radius: 50%;

      &>svg {
        font-size: 1.5rem;
      }

      &:hover {
        opacity: 1;
        border: 1px solid var(--pal-outlineVariant);
        transform: translateY(-1px);
      }
    }
  }
}
</style>