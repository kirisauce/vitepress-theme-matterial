import { inject, InjectionKey, provide } from "vue";

export interface ThemeRouter {
  /**
   * Try jump to the target url.
   * This method will ask the user to confirm the operation.
   * The returned `Promise` resolves when the user confirmed the operation
   * and rejects when the user rejects the operation.
   * 
   * TODO: Implement the confirm dialog.
   * 
   * @param url Target url
   */
  tryJump(url: string): Promise<void>,

  /**
   * Try open the target url.
   * This method will ask the user to confirm the operation.
   * The returned `Promise` resolves when the user confirmed the operation
   * and rejects when the user rejects the operation.
   * 
   * TODO: Implement the confirm dialog.
   * 
   * @param url Target url
   */
  tryOpen(url: string): Promise<void>,
}

const KEY_THEME_ROUTER = Symbol('ThemeRouter') as InjectionKey<ThemeRouter>

export const initThemeRouter = () => {
  const themeRouter = {
    tryJump(url: string): Promise<void> {
      location.assign(url)
      return new Promise((resolve) => resolve())
    },

    tryOpen(url: string): Promise<void> {
      window.open(url)
      return new Promise((resolve) => resolve())
    },
  }

  provide(KEY_THEME_ROUTER, themeRouter)

  return themeRouter
}

export const useThemeRouter = () => inject(KEY_THEME_ROUTER)