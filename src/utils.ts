import { DeepReadonly, h, onMounted, onUnmounted, readonly, ref, Ref, watchEffect } from 'vue'
import { argbFromHex, Hct } from '@material/material-color-utilities'

export function objectShrink<Obj extends Record<string, any> | Array<any>>(obj: Obj): Obj {
  if (typeof obj != 'object') {
    return obj
  }

  if (obj instanceof Array) {
    return obj.filter(v => v !== undefined) as any
  } else {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined)) as any
  }
}

export const hctFromHex = (hex: string) => Hct.fromInt(argbFromHex(hex))

export const cssHexFromArgb = (argb: number): string => {
  const hex = argb.toString(16).padStart(8, '0')
  return `#${hex.substring(2)}${hex.substring(0, 2)}`
}

export const cssHexColorWith = (cssColor: string, mod?: { a?: number, r?: number, g?: number, b?: number }) => {
  let out = '#'
  let idx = 1
  const _mod = (n?: number) => {
    if (n === undefined) {
      out += cssColor.substring(idx, idx + 2)
    } else {
      out += n.toString(16).padStart(2, '0').substring(0, 2)
    }
    idx += 2
  }
  _mod(mod?.r)
  _mod(mod?.g)
  _mod(mod?.b)
  _mod(mod?.a)
  return out
}

export const objectPropertiesAddPrefix = (prefix: string, obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [prefix + k, v]))
}

export const writeClipboardText = (textData: string) => {
  try {
    return navigator.clipboard.writeText(textData)
  } catch {
    const el = document.createElement('textarea')
    const previouslyFocusedEl = document.activeElement as (HTMLElement | undefined)
    el.setAttribute('readonly', '')
    el.style.contain = 'strict'
    el.style.position = 'fixed'
    el.style.left = '114514px'
    el.value = textData

    document.body.appendChild(el)

    const selection = document.getSelection()

    el.select()
    el.selectionStart = 0
    el.selectionEnd = textData.length
    document.execCommand('copy')
    el.remove()

    if (previouslyFocusedEl) {
      previouslyFocusedEl.focus()
    }
  }
}

// export const useIconConfig = (icon?: ConfiguredIcon) => {
//   if (!icon) {
//     return undefined
//   }
//   if (typeof icon === 'string') {
//     return h('img', { src: icon, class: 'configured-icon' })
//   } else {
//     return icon
//   }
// }

export const joinStringList = (stringList: string[], sep: string): string => {
  let output = ''
  let isFirst = true

  for (const item of stringList) {
    if (isFirst) {
      isFirst = false
    } else {
      output += sep
    }
    output += item
  }

  return output
}

// ---------- Material 3 Animation Curves Begin ----------

export namespace AnimationPresets {
  export interface TransitionAnimationPreset {
    curve: string,
    durationMs: number,
  }

  const anim = (curve: string, durationMs: number) => {
    return { curve, durationMs } satisfies TransitionAnimationPreset
  }

  export const m3 = {
    expressiveFastSpital: anim("cubic-bezier(0.42, 1.67, 0.21, 0.90)", 350),
    expressiveDefaultSpital: anim("cubic-bezier(0.38, 1.21, 0.22, 1.00)", 500),
    expressiveSlowSpital: anim("cubic-bezier(0.39, 1.29, 0.35, 0.98)", 600),

    expressiveFastEffects: anim("cubic-bezier(0.31, 0.94, 0.34, 1.00)", 150),
    expressiveDefaultEffects: anim("cubic-bezier(0.34, 0.80, 0.34, 1.00)", 200),
    expressiveSlowEffects: anim("cubic-bezier(0.34, 0.88, 0.34, 1.00)", 300),

    standardFastSpital: anim("cubic-bezier(0.27, 1.06, 0.18, 1.00)", 350),
    standardDefaultSpital: anim("cubic-bezier(0.27, 1.06, 0.18, 1.00)", 500),
    standardSlowSpital: anim("cubic-bezier(0.27, 1.06, 0.18, 1.00)", 750),

    standardFastEffects: anim("cubic-bezier(0.31, 0.94, 0.34, 1.00)", 150),
    standardDefaultEffects: anim("cubic-bezier(0.34, 0.80, 0.34, 1.00)", 200),
    standardSlowEffects: anim("cubic-bezier(0.34, 0.88, 0.34, 1.00)", 300),
  }
}

// ----------  ----------

// ---------- Persistent Value Begin ----------

export interface PersistentValueOptions<T> {
  serialize?: (value: T) => string,
  deserialize?: (serialized: string) => T,
}

export const createPersistentValue = <T>(
  name: string, defaultValue: T | (() => T),
  options?: PersistentValueOptions<T>,
): Ref<T> => {
  const newOptions = {
    serialize(value: T) {
      return JSON.stringify(value)
    },
    deserialize(serialized: string) {
      return JSON.parse(serialized)
    },
    ...objectShrink(options ?? {})
  }

  let value
  const serialized = window.localStorage.getItem(name)
  if (serialized === null) {
    if (typeof defaultValue == 'function') {
      value = (defaultValue as any)()
    } else {
      value = defaultValue
    }
  } else {
    value = newOptions.deserialize(serialized)
  }

  const valueRef = ref(value)

  watchEffect(() => {
    if (window.localStorage) {
      window.localStorage.setItem(name, newOptions.serialize(valueRef.value))
    }
  })

  return valueRef
}

// ---------- Persistent Value End ----------

// ---------- Media Query Wrapper Begin ----------

/**
 * Create a vue reactive value that generated from the match value of mediaQueryString.
 * This function uses `onMounted` and `onUnmounted` hooks from `vue`, so it is not possible
 * to run this function out of a `<script setup>` block of a `.vue` file.
 * 
 * @param mediaQueryString The string that would be passed to `window.matchMedia`
 * @param argTransform The function to transform boolean value to value of other types
 */
export function createMediaQueryWrapper<T>(
  mediaQueryString: string,
  transform: (matchResult: boolean) => T,
  defaultVal?: T,
): DeepReadonly<Ref<typeof defaultVal extends undefined ? (T | undefined) : T>> {
  const valueRef = ref(defaultVal)

  const handler = function (this: MediaQueryList) {
    valueRef.value = transform(this.matches)
  }

  let list: MediaQueryList | undefined

  onMounted(() => {
    list = window.matchMedia(mediaQueryString)
    valueRef.value = transform(list.matches)
    list.addEventListener("change", handler)
  })

  onUnmounted(() => {
    list!.removeEventListener("change", handler)
  })

  return readonly(valueRef as Ref<any>)
}

// ---------- Media Query Wrapper End ----------