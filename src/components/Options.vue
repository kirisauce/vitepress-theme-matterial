<script setup lang="ts">
import { FunctionalComponent } from 'vue';

interface Option {
  id: string,
  text?: string,
  icon?: FunctionalComponent,
}

defineEmits<{
  (e: 'select', id: string): void,
}>()

const {
  options,
  selected,
  display = true,
} = defineProps<{
  options: Option[],

  /** 当前选中的选项id */
  selected?: string,

  display?: boolean,
}>()
</script>

<template>
  <Transition name='opt'>
    <div v-if='display' class='options'>
      <div v-for='opt in options' :class="{ option: true, selected: opt.id === selected }"
        @click='$emit("select", opt.id)'>
        <component v-if='opt.icon' :is='opt.icon'></component>{{ opt.text ?? opt.id }}
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '../styles/abstract/m3-anim';

.options {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  gap: 16px;
  left: 50%;
  transform: translate(-50%, 100%);
  background-color: var(--palext-primaryContainerTransparent);
  color: var(--pal-onPrimaryContainer);
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 5px var(--pal-shadow);
  backdrop-filter: blur(12px);
}

.option {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: max-content;
  cursor: pointer;
  view-transition-name: none;

  &.selected {
    font-weight: bold;
  }
}

.opt-enter-active,
.opt-leave-active {
  transform-origin: 50% 0;
  transition:
    transform m3-anim.$expressiveDefaultSpital,
    opacity m3-anim.$expressiveDefaultSpital;
}

.opt-enter-from,
.opt-leave-to {
  opacity: 0;
  transform: translate(-50%, 90%) scale(0.6, 0.02);
}

.opt-enter-to,
.opt-leave-from {
  opacity: 1;
  transform: translate(-50%, 100%) scale(1, 1);
}
</style>