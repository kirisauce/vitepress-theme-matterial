<script lang='ts' setup>
import { ref, computed, h, useCssModule } from 'vue'
import { generateRange } from '../shared/utils';
import MdButton from './MdButton.vue';

const {
  minPage,
  maxPage,
  currentPage,
  near = 2
} = defineProps<{
  /** 最小页码 */
  minPage: number
  /** 最大页码 */
  maxPage: number
  /** 当前页码 */
  currentPage: number
  /** 显示当前页前后页数 */
  near?: number
}>()

const classes = useCssModule()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

let inputPage = $ref('')

// 验证页码是否有效
const isValidPage = (page: number): boolean => page >= minPage && page <= maxPage

// 跳转到指定页码
const goToPage = (page: number) => {
  if (isValidPage(page) && page !== currentPage) {
    emit('change', page)
  }
}

// 处理输入框变化
const jumpFromInput = () => {
  if (inputPage === '') {
    return
  }

  const page = parseInt(inputPage)
  if (!isNaN(page) && isValidPage(page)) {
    goToPage(page)
  }
}

// 处理输入框回车事件
const handleInputKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    jumpFromInput()
  }
}

let previousInput = ''

// 处理输入框输入
const handleInput = (e: Event) => {
  if (inputPage.length > 0) {
    const numValue = parseInt(inputPage)
    if (isNaN(numValue)) {
      inputPage = previousInput
      return
    } else if (numValue > maxPage) {
      inputPage = maxPage.toString()
    } else if (numValue < minPage) {
      inputPage = minPage.toString()
    }
  }

  previousInput = inputPage
}

const generateNumbers = (): { numbers: number[], leftOmitted: boolean, rightOmitted: boolean } => {
  let numbers = generateRange(Math.max(minPage, currentPage - near), Math.min(maxPage, currentPage + near) + 1)

  return {
    numbers,
    leftOmitted: numbers.at(0)! - minPage > 1,
    rightOmitted: maxPage - numbers.at(-1)! > 1,
  }
}

// 显示页码的渲染函数
const renderButtons = () => {
  const renderButton = (n: number) => h('button', {
    class: {
      'page-button': true,
      [classes['page-button']]: true,
      [classes['active']]: n === currentPage,
    },
    key: n,
    onClick: () => goToPage(n),
  }, [n.toString()])

  const {
    numbers,
    leftOmitted,
    rightOmitted,
  } = generateNumbers()

  let fragments: any[] = []

  if (numbers.at(0) !== minPage) {
    fragments.push(renderButton(minPage))
  }
  if (leftOmitted) {
    fragments.push(h('span', {}, ['...']))
  }

  numbers.forEach(val => {
    fragments.push(renderButton(val))
  })

  if (rightOmitted) {
    fragments.push(h('span', {}, ['...']))
  }
  if (numbers.at(-1) !== maxPage) {
    fragments.push(renderButton(maxPage))
  }

  return fragments
}
</script>

<template>
  <div class='page-selector'>
    <!-- 页码按钮 -->
    <div class='pages-container'>
      <component :is='renderButtons' />
    </div>

    <!-- 手动输入页码 -->
    <div class='input-container'>
      <input v-model='inputPage' class='page-input' @keydown='handleInputKeyDown' @input='handleInput'
        placeholder='跳转到...' />
      <MdButton type='outlined' class='go-button' @click='jumpFromInput'>跳转</MdButton>
    </div>
  </div>
</template>

<style lang='scss' module>
@use '../styles/abstract/m3-anim';

.page-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--pal-outline);
  background-color: var(--pal-surface);
  color: var(--pal-onSurface);
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    color m3-anim.$expressiveDefaultEffects,
    border m3-anim.$expressiveDefaultEffects,
    background-color m3-anim.$expressiveDefaultEffects;

  &:hover:not(.disabled):not(.active) {
    background-color: var(--pal-surfaceVariant);
    color: var(--pal-onSurfaceVariant);
  }

  &.active {
    background-color: var(--pal-primary);
    color: var(--pal-onPrimary);
    border-color: var(--pal-primary);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

<style lang='scss' scoped>
@use '../styles/abstract/font';
@use '../styles/abstract/m3-anim';

.page-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem 0;

  justify-content: space-between;
  align-items: center;

  font: font.$monospace;
}

.pages-container {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.input-container {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  flex-direction: row;

  transition: border m3-anim.$expressiveDefaultEffects;

  flex: 0 1 80px;
}

.page-input {
  display: block;
  padding: 0.5rem;
  border: 2px solid var(--pal-outline);
  border-radius: 0.5rem;
  background-color: var(--pal-surface);
  color: var(--pal-onSurface);
  flex: 1 1 40px;

  transition: border m3-anim.$expressiveDefaultEffects;

  &:focus {
    outline: none;
    border-color: var(--pal-primary);
  }
}

.go-button {
  width: max-content;
}
</style>