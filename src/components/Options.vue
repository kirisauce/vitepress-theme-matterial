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
} = defineProps<{
  options: Option[],

  /** 当前选中的选项id */
  selected?: string,
}>()
</script>

<template>
  <Transition name='opt'>
    <div class='options'>
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
}

.opt-enter-active,
.opt-leave-active {
  transition: opacity m3-anim.$expressiveDefaultSpital;
}

.opt-enter-from,
.opt-leave-to {
  opacity: 0;
}

.opt-enter-to,
.opt-leave-from {
  opacity: 1;
}
</style>