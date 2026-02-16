import { FunctionalComponent } from 'vue'

export type ConfiguredIcon = string | FunctionalComponent

export interface AuthorInfo {
  /** URL that points to avatar for the author. */
  avatar?: string,
}

export interface License {
  /**
   * License name.
   */
  name: string,

  /**
   * Description of this license.
   */
  footerDescription: string,

  /**
   * URL to the legalcode of this license.
   */
  url: string,

  /**
   * License family.
   * This property affects the used icon.
   */
  family?: string,
}

export interface LicenseFamily {
  logo?: string,
}

export interface ThemeConfig {
  /** Default author for posts that do not have any author specified. */
  author?: string,

  /**
   * Profile for authors.
   */
  authorProfiles?: { [s: string]: AuthorInfo },

  navigator?: {
    /**
     * Text to be shown as the site's name on the navigator.
     * If this value is omitted, configured site-level name would be used instead.
    */
    siteText?: string,

    /**
     * Icon to be shown as the site's icon on the navigator.
     * 
     * Example:
     *  - `icon("mdi:github") // 'icon' is from '/node'`
     *  - `"/site-icon.png"`
     */
    siteIcon?: ConfiguredIcon,
  },

  /**
   * License-related configuration.
   */
  license?: {
    /**
     * Default license applied to every posts.
     * 
     * ## Example Values
     *  - "cc-by-4.0"
     */
    default?: string,

    /**
     * Available licenses.
     */
    licenses?: Record<string, License>,

    /**
     * License families.
     */
    families?: Record<string, LicenseFamily>,
  },
}