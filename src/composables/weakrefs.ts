import { inject, InjectionKey, provide } from "vue"

const WEAKREFS_KEY = Symbol('weakrefs') as InjectionKey<WeakRefs>

export type WeakRefs = WeakMap<Symbol, any>

export const initWeakRefs = (): WeakRefs => {
  const weakrefs = new WeakMap<Symbol, any>()
  provide(WEAKREFS_KEY, weakrefs)
  return weakrefs
}

export const useWeakRefs = (): WeakRefs => inject(WEAKREFS_KEY)!

export namespace Keys {
  export const NAVIGATOR_CLICK_HANDLER = Symbol('NavigatorClickHandler')
}