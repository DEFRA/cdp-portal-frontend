import { addSeconds } from 'date-fns'

import { config } from '~/src/config/config.js'

/**
 * @typedef {object} FeatureToggle
 * @property {string} id
 * @property {string} name - User friendly name of the feature toggle
 * @property {string} url - A base url to feature toggle an entire section or a specific path
 * @property {boolean} [enabled=false] - If the feature toggle has been turned on
 * @property {string} [enabledAt=now] - ISO 8601 format date when the toggle was set
 * @property {string} [expiresAt] - ISO 8601 format date when the toggle will expire
 */

/**
 * Feature Toggle Helper class to manage feature toggles in catbox and the application
 */
class FeatureToggleHelper {
  /**
   * List of feature toggles
   * @type {FeatureToggle[]}
   */
  static featureToggles = [
    {
      id: 'disable-create-service',
      name: 'Disable create service',
      url: '/create'
    },
    {
      id: 'disable-decommission',
      name: 'Disable decommission',
      url: '/admin/decommissions/start'
    }
  ]

  /**
   * @param {Policy} featureTogglesCache - Hapi server cache instance
   * @param {FeatureToggle[]} [featureToggles] - Optional list of feature toggles to override the default ones
   */
  constructor(
    featureTogglesCache,
    featureToggles = FeatureToggleHelper.featureToggles
  ) {
    this.featureTogglesCache = featureTogglesCache
    this.featureToggles = featureToggles
  }

  /**
   * @param {string} id
   * @returns {string}
   */
  #buildKey(id) {
    return `feature-toggle:${id}`
  }

  /**
   * @param {string} id - id of the feature toggle
   * @returns {Promise<FeatureToggle|null>} The feature toggle object or null if not found
   */
  async get(id) {
    const data = await this.featureTogglesCache.get(this.#buildKey(id))

    return data ? JSON.parse(data) : null
  }

  /**
   * @returns {Promise<FeatureToggle[]>}
   */
  getAll() {
    const promises = this.featureToggles.map(async ({ id, name, url }) => {
      const featureDetail = await this.get(id)

      return {
        id,
        name,
        url,
        enabled: featureDetail?.enabled,
        enabledAt: featureDetail?.enabledAt,
        expiresAt: featureDetail?.expiresAt
      }
    })

    return Promise.all(promises)
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async toggle(id) {
    const now = new Date()
    const expiresAt = addSeconds(now, config.get('redis.ttl') / 1000)

    const featureToggle = await this.get(id)
    const featureValues = {
      enabled: true,
      enabledAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    }

    if (featureToggle === null) {
      featureValues.enabled = true
    } else {
      featureValues.enabled = !featureToggle.enabled
    }

    await this.featureTogglesCache.set(
      this.#buildKey(id),
      JSON.stringify(featureValues)
    )
  }

  /**
   * Has the feature toggle been turned on for the given request path?
   * @param {string} requestPath - A base url for a section or a specific path
   * @returns {Promise<boolean>} - true if feature is feature flagged, false otherwise
   */
  async isEnabled(requestPath) {
    const featureToggleDetail = this.featureToggles.find(
      (featureToggle) =>
        requestPath.startsWith(featureToggle.url) ||
        requestPath === featureToggle.url
    )

    if (!featureToggleDetail) {
      return false
    }

    const featureToggle = await this.get(featureToggleDetail.id)
    return featureToggle?.enabled ?? false
  }
}

export { FeatureToggleHelper }

/**
 * {import('@hapi/catbox').Policy}
 */
