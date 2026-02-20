<script lang='ts' setup>
import { h, onMounted, reactive, StyleValue, useTemplateRef, watch } from 'vue';
import { TocItem, useToc } from '../composables/toc'
import { joinStringList } from '../utils';

const emit = defineEmits<{
  (e: 'click', item: TocItem): void,
}>()

const {
  ulStyle = undefined,
} = defineProps<{
  ulStyle?: StyleValue,
}>()

const {
  items,
  activeId,
} = useToc()

const indicatorStyle = reactive({
  width: 200,
  height: 0,
  top: 0,
  left: 0,
  opacity: 0,
})

const elList = useTemplateRef('elList')

const transformStyle = (rawStyle: any) => Object.fromEntries(Object.entries(rawStyle).map(([k, v]) => {
  if (k === 'opacity') {
    return [k, `${v}`]
  } else {
    return [k, `${v}px`]
  }
}))

const getListItemStyle = (item: TocItem) => {
  return {
    "margin-left": `${item.level - 1}ch`,
    color: item.id === activeId.value ? "var(--pal-onPrimary)" : "",
  }
}

const getItemElement = (id?: string) => elList.value?.querySelector(`ul>li[title-id='${id ?? activeId.value}']`) as HTMLElement

const hideIndicator = () => {
  Object.entries({
    width: 200,
    height: 0,
    top: 0,
    left: 0,
    opacity: 0,
  }).forEach(([k, v]) => {
    (indicatorStyle as any)[k] = v
  })
}

const updateIndicator = (id?: string) => {
  const el = getItemElement(id)
  if (!el) {
    hideIndicator()
    return
  }
  const listRect = elList.value!.getBoundingClientRect()
  const itemRect = el.getBoundingClientRect()

  const ygrow = 4
  const xgrow = 20
  const height = itemRect.height + ygrow
  const width = itemRect.width + xgrow
  const top = itemRect.top - listRect.top - ygrow / 2
  const left = itemRect.left - listRect.left - xgrow / 2

  indicatorStyle.opacity = 1.0
  indicatorStyle.top = top
  indicatorStyle.left = left
  indicatorStyle.height = height
  indicatorStyle.width = width
}

const adjustScroll = (id?: string) => {
  const el = getItemElement(id)
  if (!el) {
    return
  }

  const elParent = el.parentElement!
  elParent.scrollTo({
    left: elParent.scrollTop,
    top: el.offsetTop,
    behavior: 'smooth',
  })
}

const renderList = () => {
  // <template v-for='item in items'>
  //   <li class='toc-item' :title-id='item.id' :style='getListItemStyle(item)'>{{ item.text }}</li><br/>
  // </template>
  let counters: number[] = []

  return items.value.flatMap(item => {
    if (counters.length >= item.level) counters[item.level - 1]++;
    while (counters.length < item.level) counters.push(1);
    while (counters.length > item.level) counters.pop();

    const counterText = `${counters[counters.length - 1]}`
    const children = [
      h('span', { style: 'opacity: 0.5; font-size: 0.85em;' }, [counterText]),
      item.text,
    ]

    const elLi = h('li', {
      'class': 'toc-item',
      'title-id': item.id,
      'style': getListItemStyle(item),

      onClick: () => emit('click', item),
    }, children)

    return [elLi, h('br')]
  })
}

onMounted(() => {
  watch(activeId, (id) => {
    updateIndicator(id)
    adjustScroll(id)
  }, {
    immediate: true,
  })
  elList.value!.addEventListener('scroll', () => updateIndicator())
})

defineExpose({
  adjustScroll,
  updateIndicator,
  hideIndicator,
})
</script>

<style scoped lang='scss'>
@use '../styles/abstract/m3-anim';

.toc {
  position: relative;
  overflow: hidden;
}

.indicator {
  position: absolute;
  display: block;
  border-radius: 10px;
  border: 1px solid var(--pal-outline);
  background-color: var(--palext-primary);
  z-index: -10;

  $anim: m3-anim.$expressiveFastSpital;

  transition:
    width $anim,
    height $anim,
    top $anim,
    left $anim,
    opacity m3-anim.$expressiveDefaultEffects;
}

ul {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0.5em 0.5em 0.5em 0.25em;
  margin: 0;
  z-index: 100;

  :deep(li) {
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.5em;
    transition: color m3-anim.$expressiveDefaultEffects;
  }
}
</style>

<template>
  <div class='toc'>
    <div class='indicator' :style='transformStyle(indicatorStyle)'></div>
    <ul ref='elList' :style='ulStyle'>
      <renderList />
    </ul>
  </div>
</template>