import { Icon } from "./other";

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
  logo?: Icon,
}

export interface LicenseConfig {
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
}