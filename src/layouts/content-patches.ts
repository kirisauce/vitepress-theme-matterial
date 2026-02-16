import { writeClipboardText, AnimationPresets } from '../utils'

import MdiLinkRaw from '~icons/mdi/link?raw'

/**
 * Add line number for code blocks.
 */
// export const patchCodeLineNumber = (root: HTMLElement) => {
//   root.querySelectorAll('pre.shiki>code').forEach(elCode => {
//     const lines = Array.from(elCode.children)
//     const lineNumberLength = lines.length.toString().length
//     lines.forEach((elLine, idx) => {
//       elLine.setAttribute("line-number", (idx + 1).toString().padStart(lineNumberLength, ' '))
//     })
//   })
// }

/**
 * Add decoration elements to code blocks
 */
// export const patchCodeDecorations = (root: HTMLElement) => {
//   root.querySelectorAll('div[class*="language"]').forEach(elLang => {
//     // Add decoration elements for code blocks
//     const decoration = document.createElement('div')
//     decoration.classList.add('bkgr-decoration')
//     elLang.appendChild(decoration)

//     elLang.querySelectorAll('.copy').forEach(elButton => {
//       // Add text for all `Copy` buttons
//       elButton.setHTMLUnsafe(MdiContentCopyRaw as any as string)

//       // Disable context menu
//       elButton.addEventListener("contextmenu", ev => ev.preventDefault())
//     })
//   })
// }

/**
 * Modify the anchor's display and behaviors.
 */
export const patchAnchors = (root: HTMLElement) => {
  const animProp = AnimationPresets.m3.expressiveFastSpital

  // Add icon to the header anchor elements
  root.querySelectorAll('.header-anchor').forEach((elAnchor: HTMLAnchorElement) => {
    elAnchor.innerHTML = MdiLinkRaw as any as string

    const href = elAnchor.getAttribute('href')
    const elCopyText = document.createElement('div')
    elCopyText.classList.add('copy-text')

    elAnchor.removeAttribute('href')

    // Transition animations
    let anim: Animation
    let oldWidth: number
    const actionShow = (text: string) => {
      const curWidth = elAnchor.clientWidth
      if (anim !== undefined) {
        elAnchor.style.width = ''
        anim.cancel()
        anim = undefined
      }
      elCopyText.textContent = text
      elAnchor.classList.add('visible')

      if (oldWidth === undefined) {
        oldWidth = elAnchor.scrollWidth
      }
      const desiredWidth = elCopyText.clientWidth + oldWidth
      anim = elAnchor.animate([
        { width: `${curWidth}px` },
        { width: `${desiredWidth.toString()}px` },
      ], {
        duration: animProp.durationMs,
        easing: animProp.curve,
      })
      anim.addEventListener('finish', () => {
        elAnchor.style.width = `${desiredWidth.toString()}px`
        anim = undefined
      })
    }
    const actionHide = () => {
      const curWidth = elAnchor.clientWidth
      if (anim !== undefined) {
        elAnchor.style.width = ''
        anim.cancel()
        anim = undefined
      }
      elCopyText.textContent = ''
      elAnchor.classList.remove('visible')

      if (oldWidth) {
        anim = elAnchor.animate([
          { width: `${curWidth}px` },
          { width: `${oldWidth.toString()}px` },
        ], {
          duration: animProp.durationMs,
          easing: animProp.curve,
        })
        anim.addEventListener('finish', () => {
          elAnchor.style.width = ''
          anim = undefined
        })
        oldWidth = undefined
      }
    };

    // Copied effect
    let prevTimeout: NodeJS.Timeout
    let isHovered = false
    elAnchor.addEventListener('pointerenter', () => {
      isHovered = true
      if (prevTimeout === undefined)
        actionShow('复制链接')
    })
    elAnchor.addEventListener('pointerleave', () => {
      isHovered = false
      if (prevTimeout === undefined)
        actionHide()
    })
    elAnchor.addEventListener('click', ev => {
      if (prevTimeout === undefined) {
        actionShow('已复制')
      } else {
        clearTimeout(prevTimeout)
      }

      ev.preventDefault()
      ev.stopImmediatePropagation()
      writeClipboardText(location.origin + location.pathname + location.search + href)

      prevTimeout = setTimeout(() => {
        prevTimeout = undefined
        if (isHovered) {
          actionShow('复制链接')
        } else {
          actionHide()
        }
      }, 3000)

      return false
    })

    elAnchor.appendChild(elCopyText)
  })
}