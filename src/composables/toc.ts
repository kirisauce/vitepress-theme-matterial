import { inject, InjectionKey, provide, ref, Ref } from "vue";

/**
 * A catalog item. Usually corresponds to an `h1`, `h2`, `h3` or `h4` element.
 */
export interface TocItem {
  text: string,
  id: string | undefined,
  level: number,
  targetElement: HTMLElement,
}

export const extractCatalogFromDom = (root: HTMLElement) => {
  return Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(elTitle => {
    return {
      get text() {
        return elTitle.textContent.trim()
      },
      get id() {
        return elTitle.id.length == 0 ? undefined : elTitle.id
      },
      get level() {
        return Number.parseInt(elTitle.tagName.substring(1))
      },
      targetElement: elTitle as HTMLElement,
    } satisfies TocItem
  })
}

export interface TocData {
  items: Ref<TocItem[]>,
  activeId: Ref<string | null>,
}

const TOC_KEY = Symbol('TableOfContent') as InjectionKey<TocData>

export const initToc = () => {
  const state = {
    items: ref([]),
    activeId: ref(),
  } satisfies TocData

  provide(TOC_KEY, state)

  return state
}

export const useToc = () => inject(TOC_KEY)