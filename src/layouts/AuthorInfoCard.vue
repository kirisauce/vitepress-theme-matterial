<script lang="ts" setup>
import { useData } from 'vitepress';
import { AuthorInfo, ExternalSite, ThemeConfig } from '../shared/theme'
import { componentFromSvgText } from '../shared/svg-helper';
import ExternalLink from './ExternalLink.vue';

interface Props {
  author: AuthorInfo & { name: string } | null,
}

defineProps<Props>()
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
      <ExternalLink v-for='(link, siteName) in author.externalLinks' :site-name='siteName' :link='link' />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/m3-anim';

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
  }
}
</style>