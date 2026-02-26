export const mayStartViewTransition = (fun?: (() => any) | StartViewTransitionOptions): void => {
  if (!!document.startViewTransition) {
    document.startViewTransition(fun)
  } else if (typeof fun === 'function') {
    fun()
  } else if (fun === undefined) {
    return
  } else {
    fun.update?.()
  }
}