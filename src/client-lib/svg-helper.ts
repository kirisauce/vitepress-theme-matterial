import { parseSVGContent } from '@iconify/utils/lib/svg/parse'
import { FunctionalComponent, h, mergeProps } from 'vue'

export const componentFromSvgText = (svgText: string): FunctionalComponent => (props, ctx) => {
  const parsed = parseSVGContent(svgText)
  if (parsed === undefined) {
    throw Error(`Failed to parse SVG content\n${svgText}`)
  }

  return h('svg', mergeProps(
    { innerHTML: parsed.body },
    parsed.attribs,
    props,
    ctx.attrs,
  ))
}