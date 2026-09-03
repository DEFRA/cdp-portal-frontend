import pullAll from 'lodash/pullAll.js'

import { config } from '#config/config.js'
import { sortBy } from '../../../../../helpers/sort/sort-by.js'
import { platformKeyDescriptions } from '../../../../../constants/platform-key-descriptions.js'
import { noValue } from '../../../../../constants/no-value.js'

/**
 * Transforms secrets for a given environment by filtering out platform global keys and placeholders,
 * and categorizing them into service secrets and platform secrets.
 * @param {object | null} secrets - The secrets object containing keys.
 * @param {string[]} [platformGlobalSecretKeys] - The list of platform global secret keys defaults to config.get('platformGlobalSecretKeys').
 * @returns {object} An object containing:
 *   - serviceSecrets: The filtered and sorted service secrets.
 *   - platformSecrets: The platform secrets with descriptions.
 */
function environmentSecrets(
  secrets,
  platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')
) {
  const secretsCopy = secrets?.keys ? [...secrets.keys] : []
  const excludedKeys = [
    ...platformGlobalSecretKeys,
    'automated_placeholder',
    'placeholder'
  ]
  const secretsWithOutExcludedKeys = (
    secrets?.keys ? pullAll(secretsCopy, excludedKeys) : []
  ).map((key) => ({ key, status: 'available' }))

  const serviceSecrets = {
    ...secrets,
    keys: [...secretsWithOutExcludedKeys].sort(sortBy('key', 'asc')) ?? []
  }
  const platformSecrets = platformGlobalSecretKeys
    .map(
      (key) =>
        secrets?.keys?.includes(key) && {
          key,
          description: platformKeyDescriptions[key] ?? noValue
        }
    )
    .filter(Boolean)
    .sort(sortBy('key', 'asc'))

  return {
    serviceSecrets,
    platformSecrets
  }
}

export { environmentSecrets }
