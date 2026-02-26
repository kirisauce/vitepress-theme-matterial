import { DynamicScheme } from '@material/material-color-utilities'
import { ComputedRef, inject, type InjectionKey } from 'vue'
import { cssHexColorWith, cssHexFromArgb } from '../shared/utils'

export const PALETTE_EXPORTS = [
  'shadow',
  'outline',
  'outlineVariant',
  'scrim',

  'primary',
  'primaryContainer',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimary',
  'onPrimaryContainer',
  'onPrimaryFixed',

  'secondary',
  'secondaryContainer',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondary',
  'onSecondaryContainer',
  'onSecondaryFixed',

  'tertiary',
  'tertiaryContainer',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiary',
  'onTertiaryContainer',
  'onTertiaryFixed',

  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceVariant',
  'onSurface',
  'onSurfaceVariant',

  'inverseSurface',
  'inverseOnSurface',

  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',

  'background',
  'onBackground',

  'error',
  'errorContainer',
  'onError',
  'onErrorContainer',
]

export class ColorRgba {
  cssrgba: string

  constructor(cssrgba: string) {
    this.cssrgba = cssrgba
  }

  get css(): string {
    return this.cssrgba
  }

  get rgba(): string {
    return this.cssrgba
  }

  withmod(mod: { a?: number, r?: number, g?: number, b?: number }) {
    return new ColorRgba(cssHexColorWith(this.cssrgba, mod))
  }
}

/**
 * Construct a new `ColorRgba` from a argb color number.
 * @param argb ARGB32 color
 * @returns `ColorRgba` instance
 */
export function c(argb: number): ColorRgba {
  return new ColorRgba(cssHexFromArgb(argb))
}

export const PALETTE_KEY = Symbol('ColorPalette') as InjectionKey<ComputedRef<DynamicScheme>>

export const usePalette = () => inject(PALETTE_KEY)!!

export const createPaletteStyle = (p: DynamicScheme) => {
  const entries = PALETTE_EXPORTS.map((exportedKey: string) => {
    const color = (p as any)[exportedKey]
    return [`--pal-${exportedKey}`, cssHexFromArgb(color)]
  })

  return Object.fromEntries(entries)
}

const processPaletteStyleExt = (obj: { [s: string]: any }, prefix: string): { [s: string]: any } => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
    if (k.endsWith('Transparent')) {
      v = cssHexColorWith(obj[k.replace(/Transparent$/, '')], { a: 160 })
    }

    return [prefix + k, v]
  }))
}

export const createPaletteStyleExt = (p: DynamicScheme, isDark: boolean) => {
  let palext

  if (isDark) {
    palext = {
      info: '#115171ff',
      infoTransparent: '#11517190',
      onInfo: '#f7edf6ff',

      tip: '#1e6031ff',
      tipTransparent: '',
      onTip: '#f7edf6ff',

      warning: '#9f5505ff',
      warningTransparent: '',
      onWarning: '#f7edf6ff',

      important: '#727110ff',
      importantTransparent: '',
      onImportant: '#f7edf6ff',

      diffRemove: '#a13838bb',
      diffAdd: '#2c9546bb',
    }
  } else {
    palext = {
      info: '#66ccffff',
      infoTransparent: '',
      onInfo: '#110a1fff',

      tip: '#57ed64ff',
      tipTransparent: '',
      onTip: '#110a1fff',

      warning: '#ed9f4cff',
      warningTransparent: '',
      onWarning: '#110a1fff',

      important: '#efec42ff',
      importantTransparent: '',
      onImportant: '#110a1fff',

      diffRemove: '#fc5252bb',
      diffAdd: '#74e77abb',
    }
  }

  const TRANSPARENT_EXTS = [
    'primary',
    'secondary',
    'tertiary',
    'error',
    'primaryContainer',
    'secondaryContainer',
    'tertiaryContainer',
    'errorContainer',
    'surface',
  ]
  const pal = p as any as Record<string, number>
  for (const extname of TRANSPARENT_EXTS) {
    let ext = {} as Record<string, string>
    const extnameUpper = extname.substring(0, 1).toUpperCase() + extname.substring(1)
    ext[extname] = cssHexFromArgb(pal[extname])
    ext[extname + 'Transparent'] = ''
    ext['on' + extnameUpper] = cssHexFromArgb(pal['on' + extnameUpper])
    Object.assign(palext, ext)
  }

  Object.assign(palext, {
    outline: cssHexFromArgb(p.outline),
    outlineTransparent: '',
  })

  return processPaletteStyleExt(palext, '--palext-')
}