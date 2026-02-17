import { inject, provide, ShallowRef } from "vue";

export interface GlobalElements {
  page: Readonly<ShallowRef<HTMLDivElement | null>>,
}

const GLOBAL_ELEMENTS_KEY = Symbol('GlobalElements')

export const initGlobalElements = (data: GlobalElements) => provide(GLOBAL_ELEMENTS_KEY, data)

export const useGlobalElements = (): GlobalElements | undefined => {
  return inject(GLOBAL_ELEMENTS_KEY)
}