<script lang="ts" setup>
import { useRouter, withBase } from 'vitepress'
import { PostData } from '../shared'
import { Time } from '../shared/utils'
import MdButton from '../components/MdButton.vue'

import MdiAccessTime from '~icons/mdi/access-time'
import SvgContainer from '../components/SvgContainer.vue'

export type PostLinkCardMode = 'full' | 'simple'

interface Props {
  /** 文章数据 */
  post: PostData,
  /** 显示模式：full - 完整模式（带图片、摘要、标签），simple - 简化模式（仅标题） */
  mode?: PostLinkCardMode,
  /** 当文章没有封面图时，是否显示占位区域 */
  showImagePlaceholder?: boolean,
  /** 时间来源：'created' - 创建时间，'modified' - 更新时间 */
  timeSource?: 'created' | 'modified'
}

const router = useRouter()

const props = withDefaults(defineProps<Props>(), {
  mode: 'full',
  showImagePlaceholder: true,
  timeSource: 'modified'
})

const hasImage = $computed(() => !!props.post.image)
const hasExcerpt = $computed(() => !!props.post.excerpt)
const hasTags = $computed(() => !!props.post.tags && props.post.tags.length > 0)

// 获取显示时间
const displayTime = $computed(() => {
  const timestamp = props.timeSource === 'created'
    ? props.post.timeCreated
    : props.post.timeModified
  const prefix = props.timeSource === 'created' ? '创建于' : '更新于'
  return `${prefix}${Time.formatTimeWithRelative(timestamp)}`
})

// 点击卡片跳转
const navigateToPost = () => router.go(withBase(props.post.link))

const articleLabel = () => `阅读文章: ${props.post.title}`
</script>

<template>
  <a class="post-link-card" :class="{ 'mode-full': mode === 'full', 'mode-simple': mode === 'simple' }" :tabindex="0"
    :role="'link'" :aria-label='articleLabel()' :title='articleLabel()' @click.prevent="navigateToPost"
    @keydown.enter="navigateToPost" @keydown.space.prevent="navigateToPost" :href="withBase(props.post.link)">
    <!-- 完整模式：显示图片 -->
    <div v-if="mode === 'full' && hasImage" class="post-card-image">
      <img :src="withBase(post.image!)" :alt="post.title" />
    </div>

    <!-- 完整模式：无图片时显示占位区域 -->
    <div v-else-if="mode === 'full' && showImagePlaceholder && !hasImage" class="post-card-image-placeholder">
      <div class="placeholder-gradient"></div>
    </div>

    <!-- 卡片内容区域 -->
    <div class="post-card-content">
      <!-- 标题 -->
      <h3 class="post-card-title">
        {{ post.title }}
      </h3>

      <!-- 完整模式：显示摘要 -->
      <p v-if="mode === 'full' && hasExcerpt" class="post-card-excerpt">
        {{ post.excerpt }}
      </p>

      <!-- 完整模式：显示时间 -->
      <time v-if="mode === 'full'" class="svg-patch post-card-time"
        :datetime="new Date(props.timeSource === 'created' ? props.post.timeCreated : props.post.timeModified).toISOString()">
        <SvgContainer>
          <MdiAccessTime />
        </SvgContainer>{{ displayTime }}
      </time>

      <!-- 完整模式：显示标签 -->
      <div v-if="mode === 'full' && hasTags" class="post-card-tags">
        <MdButton class="post-card-tag" v-for="tag in post.tags" :key="tag" size="xsmall" type="tonal" shape="round">#{{
          tag }}</MdButton>
      </div>
    </div>
  </a>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/m3-anim';
@use '../styles/abstract/m3-vars';

.post-link-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;

  padding: 0;
  box-sizing: border-box;

  background-color: color(from var(--pal-surfaceContainer) srgb r g b / 0.7);
  color: var(--pal-onSurface);
  border-radius: 20px;

  overflow: hidden;

  cursor: pointer;

  transition:
    transform m3-anim.$expressiveDefaultSpital,
    box-shadow m3-anim.$expressiveDefaultEffects;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 m3-vars.$shadow-light;
  }

  // 完整模式样式
  &.mode-full {
    border: 1px solid var(--pal-outlineVariant);

    .post-card-image {
      width: 100%;
      aspect-ratio: 16 / 9;
      border: 1px solid var(--pal-outlineVariant);

      overflow: hidden;
      background-color: var(--pal-surfaceContainerHighest);

      a {
        display: block;
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform m3-anim.$expressiveSlowSpital;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .post-card-image-placeholder {
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background-color: var(--pal-surfaceContainerHighest);

      .placeholder-gradient {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg,
            var(--pal-surfaceContainerHighest) 0%,
            var(--pal-surfaceContainerLow) 50%,
            var(--pal-surfaceContainerHighest) 100%);
        opacity: 0.8;
      }
    }

    .post-card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .post-card-title {
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.3;
      margin: 0;

      color: var(--pal-onSurface);
      text-decoration: none;
      transition: color m3-anim.$expressiveDefaultEffects;

      &:hover {
        text-decoration: underline;
        color: var(--pal-primary);
      }
    }

    .post-card-time {
      font-size: 0.8rem;
      color: var(--pal-onSurfaceVariant);
      line-height: 1.4;
      margin: 0;
    }

    .post-card-excerpt {
      font-size: 0.9rem;
      color: var(--pal-onSurfaceVariant);
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-top: 0.25rem;
      border-top: solid 1px var(--palext-secondaryTransparent);

      .post-card-tag {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font: inherit;
      }
    }
  }

  // 简化模式样式
  &.mode-simple {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--pal-outlineVariant);
    background-color: transparent;
    border-radius: 0;

    &:hover {
      transform: none;
      box-shadow: none;
    }

    &:last-child {
      border-bottom: none;
    }

    .post-card-content {
      padding: 0;
    }

    .post-card-title {
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1.4;
      margin: 0;

      color: var(--pal-primary);
      text-decoration: none;
      transition: color m3-anim.$expressiveDefaultEffects;

      &:hover {
        color: var(--pal-primaryFixed);
        text-decoration: underline;
      }
    }
  }
}
</style>
