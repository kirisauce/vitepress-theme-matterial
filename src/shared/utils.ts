import { argbFromHex, Hct } from '@material/material-color-utilities'

export const hctFromHex = (hex: string) => Hct.fromInt(argbFromHex(hex))

export const cssHexFromArgb = (argb: number): string => {
  const hex = argb.toString(16).padStart(8, '0')
  return `#${hex.substring(2)}${hex.substring(0, 2)}`
}

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

export const mergeObjectRecursive = (...objects: any[]) => {
  let out = {} as Record<string, any>

  for (const obj of objects) {
    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(out[key]) && Array.isArray(val)) {
        out[key] = (out[key] as Array<any>).concat(val as Array<any>)
      } else if (typeof out[key] === 'object' && out[key] !== null && typeof val === 'object' && val !== null) {
        out[key] = mergeObjectRecursive(out[key], val)
      } else {
        out[key] = val
      }
    }
  }

  return out
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

// ---------- Time Formatting Utilities Begin ----------

export namespace Time {
  /**
   * 时间单位分解结果
   */
  export interface Duration {
    seconds: number,
    minutes: number,
    hours: number,
    days: number,
    weeks: number,
    months: number,
    years: number,
  }

  /**
   * 将秒数分解为不同时间单位的值(无进位)
   * @param seconds 秒数
   * @returns 包含各时间单位值的 Duration 对象
   */
  export const resolveDurationNoCarry = (seconds: number): Duration => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    return {
      seconds,
      minutes,
      hours,
      days,
      weeks,
      months,
      years,
    }
  }

  /**
   * 格式化 Duration 为简单的相对时间字符串
   * @param duration Duration 对象
   * @returns 相对时间字符串，如 "3 天前"、"1 小时前"
   */
  export const formatDurationSimple = (duration: Duration): string => {
    if (duration.seconds < 60) {
      return '刚刚'
    } else if (duration.minutes < 60) {
      return `${duration.minutes}分钟前`
    } else if (duration.hours < 24) {
      return `${duration.hours}小时前`
    } else if (duration.days < 7) {
      return `${duration.days}天前`
    } else if (duration.weeks < 4) {
      return `${duration.weeks}周前`
    } else if (duration.months < 12) {
      return `${duration.months}个月前`
    } else {
      return `${duration.years}年前`
    }
  }

  /**
   * 格式化时间为带相对时间的字符串
   * @param timestamp Unix 时间戳（毫秒）
   * @returns 格式化后的时间字符串，如 "2026 年 1 月 1 日 (3 天前)"
   */
  export const formatTimeWithRelative = (timestamp: number, options?: { precise: boolean }): string => {
    const {
      precise,
    } = {
      precise: false,
      ...(options ?? {})
    }

    // 计算绝对时间
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    let absoluteTime = `${year}年${month}月${day}日`

    if (precise) {
      const hour = date.getHours()
      const minute = date.getMinutes()
      absoluteTime += ` ${hour}时${minute}分`
    }

    // 计算相对时间
    const now = Date.now()
    const diffSeconds = Math.floor((now - timestamp) / 1000)
    const duration = resolveDurationNoCarry(diffSeconds)
    const relativeTime = formatDurationSimple(duration)

    return `${absoluteTime}(${relativeTime})`
  }
}

// ---------- Time Formatting Utilities End ----------

export const joinURL = (partials: (string | URL)[]) => {
  let result: URL = new URL('https://example.com/')
  for (const partial of partials) {
    result = new URL(partial, result)
  }

  return result.pathname
}

export const generateRange = (left: number, right: number): number[] => {
  let result = []
  for (let i = left; i < right; i++) {
    result.push(i)
  }
  return result
}