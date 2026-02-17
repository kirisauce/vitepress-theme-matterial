<script lang='ts' setup>
import Navigator from '../components/Navigator.vue';
import NavigatorHomeButton from '../components/NavigatorHomeButton.vue';

// @ts-ignore typescript language server无法识别vitepress编译时加载的数据
import { data } from '../data/Post.data'
</script>

<template>
  <Navigator>
    <NavigatorHomeButton />
  </Navigator>

  <ul>
    <li v-for="d in data">
      <a :href="d.link">{{ d.title }}</a>
    </li>
  </ul>
</template>