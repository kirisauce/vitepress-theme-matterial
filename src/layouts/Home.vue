<script lang='ts' setup>
import { data } from '../data/Post.data'
</script>

<template>
  <ul>
    <li v-for="d in data">
      <a :href="d.link">{{ d.title }}</a>
    </li>
  </ul>
</template>