import { computed, ComputedRef, DeepReadonly, inject, InjectionKey, provide, Ref } from 'vue'
import { createMediaQueryWrapper, createPersistentValue } from '../utils'

// ---------- Color Scheme Begin ----------

export type ColorScheme = 'dark' | 'light'
export type UserColorScheme = ColorScheme | 'system'

const COLOR_SCHEME_KEY = Symbol('ColorScheme') as InjectionKey<ColorSchemeData>

export interface ColorSchemeData {
  userColorScheme: Ref<UserColorScheme>,
  systemColorScheme: DeepReadonly<Ref<ColorScheme | undefined>>,
  colorScheme: ComputedRef<ColorScheme>,
}

export const initColorScheme = (): ColorSchemeData => {
  const userColorScheme = createPersistentValue<UserColorScheme>('userColorScheme', 'system')
  const systemColorScheme = createMediaQueryWrapper<ColorScheme>(
    "(prefers-color-scheme: light)",
    result => result ? "light" : "dark",
  )
  const colorScheme = computed<ColorScheme>(() => {
    if (userColorScheme.value == 'system') {
      return systemColorScheme.value ?? 'light'
    } else {
      return userColorScheme.value as ColorScheme
    }
  })

  const colorSchemeData = {
    userColorScheme,
    systemColorScheme,
    colorScheme,
  }
  provide(COLOR_SCHEME_KEY, colorSchemeData)
  return colorSchemeData
}

export const useColorScheme = (): ColorSchemeData => inject(COLOR_SCHEME_KEY)!

// ---------- Color Scheme End ----------

// ---------- Orientation Begin ----------

const ORIENTATION_KEY = Symbol('Orientation') as InjectionKey<Readonly<Ref<Orientation>>>
export type Orientation = "landscape" | "portrait"
export const initOrientation = (): Readonly<Ref<Orientation>> => {
  const orientation = createMediaQueryWrapper<Orientation>(
    "(orientation: landscape)",
    result => result ? "landscape" : "portrait",
  )
  provide(ORIENTATION_KEY, orientation)
  return orientation
}
export const useOrientation = (): Readonly<Ref<Orientation>> => inject(ORIENTATION_KEY)!


// ---------- Orientation End ----------

export const usePreferences = () => {
  return {
    orientation: useOrientation(),
    colorScheme: useColorScheme(),
  }
}