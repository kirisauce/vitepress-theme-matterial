<script lang='ts' setup>
import { usePageInfo } from '../composables/page-info'
import { useThemeRouter } from '../composables/theme-router';
import SvgContainer from './SvgContainer.vue';

const pg = usePageInfo()
const themeRouter = useThemeRouter()
</script>

<style lang='scss' scoped>
@use '../styles/m3-anim';

.line1 {
  display: flex block;
  flex-direction: row;
  min-height: 10em;

  >.placeholder {
    flex: 1;
  }
}

.license-box {
  position: relative;
  background-color: var(--palext-primaryTransparent);
  color: var(--pal-onPrimary);
  padding: 0.5em;
  box-shadow: var(--global-box-shadow);
  cursor: pointer;
  transition:
    transform m3-anim.$expressiveSlowSpital,
    background-color m3-anim.$expressiveSlowEffects;

  flex: 1;

  border: 1px solid var(--pal-outline);
  border-radius: 1em;
}

.license-box:hover {
  transform: scale(1.03) translateY(-1%);
  background-color: var(--pal-primary);
}

.license-name {
  font-size: x-large;
  font-weight: bold;
  text-align: center;
}

.license-box-layer-logo {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.license-logo {
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  font-size: 5em;

  transform: translate(20%, 20%) rotate(-30deg);
}
</style>

<template>
  <footer>
    <div class='line1'>
      <!-- License -->
      <div v-if='pg.license' class='license-box' @click='themeRouter.tryOpen(pg.license.url)'>
        <div class='license-name'>{{ pg.license.name }}</div>
        <span class='license-description'>{{ pg.license.footerDescription }}</span>
        <div v-if='pg.licenseFamily' class='license-box-layer-logo'>
          <SvgContainer :no-margin='true' class='license-logo' v-html='pg.licenseFamily.logo' />
        </div>
      </div>

      <!--  -->
      <div class='placeholder'></div>
    </div>
  </footer>
</template>