<script lang='ts' setup>
import { useData } from 'vitepress'
import Navigator from '../layouts/Navigator.vue'
import NavigatorHomeButton from '../layouts/Navigator/HomeButton.vue'
import AuthorInfoCard from '../layouts/AuthorInfoCard.vue'
import PostLinkCard from '../layouts/PostLinkCard.vue'
import FlowContainer from '../components/FlowContainer.vue'
import { ThemeConfig } from '../shared'
import ReactiveThreeColumns from '../layouts/ReactiveThreeColumns.vue'

import { data } from '../data/Post.data'

import cardStyle from '../styles/layout/card.module.scss'
import { provideLayoutConfigLayer } from '../composables/layout-config'

// Vitepress Data
const { site, theme } = useData<ThemeConfig>()

provideLayoutConfigLayer('home')

const config = $computed(() => theme.value.page?.home!)

// 按时间排序的文章列表（从新到旧）
const sortedPosts = $computed(() => [...data].sort((a, b) => b.timeCreated - a.timeCreated))

// 获取作者信息
const author = $computed(() => {
  // 如果主题配置了默认作者，则获取该作者的详细信息
  if (theme.value.author && theme.value.authorProfiles) {
    const profile = theme.value.authorProfiles[theme.value.author];
    if (profile) {
      return {
        ...profile,
        name: theme.value.author
      };
    }
  }
  return null;
});

// ----- 依赖主题配置的组件 -----
const secondaryTitleText = (): string | undefined => {
  switch (config.secondaryTitle) {
    case 'description':
      return site.value.description
    case 'custom':
      return config.secondaryTitleText
    default:
      return undefined
  }
}
</script>

<template>
  <Navigator>
    <NavigatorHomeButton />
  </Navigator>

  <ReactiveThreeColumns>
    <!-- Left Cards -->
    <template #left></template>

    <!-- Center Cards -->
    <template #center>
      <main :class="['layout-card', cardStyle['card-content'], cardStyle['card-appear']]">
        <div class="home-header">
          <h1>{{ site.title }}</h1>
          <p>{{ secondaryTitleText() }}</p>
        </div>
        
        <div class="posts-list-container">
          <h2>最新文章</h2>
          <FlowContainer :columns="3" gap="1rem" min-column-width="300px">
            <PostLinkCard
              v-for="d in sortedPosts"
              :key="d.link"
              :post="d"
              mode="full"
              :show-image-placeholder="theme.page?.home?.showImagePlaceholder ?? true"
              :time-source="theme.page?.home?.cardTimeSource ?? 'modified'"
              class="flow-item"
            />
          </FlowContainer>
        </div>

      </main>
    </template>

    <!-- Right Cards -->
    <template #right>
      <!-- 作者信息卡片 -->
      <AuthorInfoCard :author="author" :class="[cardStyle['card-appear'], cardStyle['card-appear-delay-1']]" />
      
      <div :class="['layout-card', cardStyle['card-toc'], cardStyle['card-appear'], cardStyle['card-appear-delay-2']]">
        <div class='toc-text'>
          最近文章
        </div>

        <div class="posts-list-widget">
          <PostLinkCard
            v-for="d in data"
            :key="d.link"
            :post="d"
            mode="simple"
          />
        </div>
      </div>
    </template>
  </ReactiveThreeColumns>
</template>

<style lang='scss' scoped>
@use '../styles/layout/card.module.scss';

.home-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 400;
    line-height: 1.2;
    color: var(--pal-onSurface);
    margin: 24px 0 16px;
    letter-spacing: -0.015em;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--pal-onSurfaceVariant);
    margin: 1rem 0;
  }
}

.posts-list-container {
  h2 {
    font-size: 1.8rem;
    font-weight: 400;
    line-height: 1.25;
    color: var(--pal-onSurface);
    margin: 24px 0 16px;
    letter-spacing: -0.015em;
  }
}

.posts-list-widget {
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>