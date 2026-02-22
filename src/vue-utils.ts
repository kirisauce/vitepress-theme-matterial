import { DeepReadonly, onMounted, onUnmounted, readonly, ref, Ref, watchEffect } from 'vue'
import { objectShrink } from './shared/utils'

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

  if (typeof window !== 'undefined') {
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
  }

  const valueRef = ref(value)

  watchEffect(() => {
    if (typeof window !== 'undefined') {
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