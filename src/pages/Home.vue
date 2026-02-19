<script lang='ts' setup>
import { useData } from 'vitepress'
import Navigator from '../components/Navigator.vue';
import NavigatorHomeButton from '../components/NavigatorHomeButton.vue';
import AuthorInfoCard from '../components/AuthorInfoCard.vue'; // 导入新组件
import { useOrientation } from '../composables/preferences';
import { ThemeConfig } from '../shared';

// @ts-ignore typescript language server无法识别vitepress编译时加载的数据
import { data } from '../data/Post.data'

// Vitepress Data
const { site, theme } = useData<ThemeConfig>()

const config = $computed(() => theme.value.layout?.home!)

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

// 使用use函数获取状态
const orientation = useOrientation()

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

  <div class='pagecontent-wrapper' ref="elMainContent">
    <!-- Left Cards -->
    <div class='layout-cards-column left-cards' v-show='orientation === "landscape"'></div>

    <!-- Center Cards -->
    <div class='layout-cards-column center-cards'>
      <main class='layout-card card-content'>
        <div class="home-header">
          <h1>{{ site.title }}</h1>
          <p>{{ secondaryTitleText() }}</p>
        </div>
        
        <div class="posts-list-container">
          <h2>最新文章</h2>
          <ul class="posts-list-ul">
            <li v-for="d in data" class="posts-list-item">
              <a :href="d.link">{{ d.title }}</a>
              <p class="post-excerpt" v-if="d.excerpt">{{ d.excerpt }}</p>
            </li>
          </ul>
        </div>
      </main>
    </div>

    <!-- Right Cards -->
    <div class='layout-cards-column right-cards' v-show='orientation === "landscape"'>
      <!-- 作者信息卡片 -->
      <AuthorInfoCard :author="author" />
      
      <div class='layout-card card-toc'>
        <div class='toc-text'>
          最近文章
        </div>

        <div class="posts-list-widget">
          <ul class="posts-list-ul">
            <li v-for="d in data" class="posts-list-item">
              <a :href="d.link">{{ d.title }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
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

.posts-list-ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.posts-list-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--pal-outlineVariant);
  
  &:last-child {
    border-bottom: none;
  }
  
  a {
    display: block;
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--pal-primary);
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--pal-primaryFixed);
      text-decoration: underline;
    }
  }
  
  .post-excerpt {
    color: var(--pal-onSurfaceVariant);
    line-height: 1.6;
    margin: 0.5rem 0 0 0;
  }
}

.posts-list-widget {
  max-height: 70vh;
  overflow-y: auto;
  
  .posts-list-ul {
    padding: 0.5rem;
  }
  
  .posts-list-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--pal-outlineVariant);
    
    &:last-child {
      border-bottom: none;
    }
  }
}

</style>