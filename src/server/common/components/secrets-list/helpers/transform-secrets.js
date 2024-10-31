import pullAll from 'lodash/pullAll.js'

import { config } from '~/src/config/index.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'

/**
 * Transforms the given secrets by excluding certain keys and sorting the remaining keys.
 * @param {object} secrets - The secrets object containing keys and lastChangedDate.
 * @param {string[]} [platformGlobalSecretKeys] - The keys to be excluded from the secrets. Defaults to config.get('platformGlobalSecretKeys')
 * @returns {object} An object containing the transformed keys, platform keys, and the last changed date.
 */
function transformSecrets(
  secrets,
  platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')
) {
  const secretsCopy = secrets?.keys ? [...secrets.keys] : []
  const excludedKeys = [
    ...platformGlobalSecretKeys,
    'automated_placeholder',
    'placeholder'
  ]

  const keys = pullAll(secretsCopy, excludedKeys).sort(sortByName)
  const platformKeys = platformGlobalSecretKeys
    .filter((key) => secrets?.keys?.includes(key))
    .sort(sortByName)

  return {
    keys: keys ?? [],
    platformKeys: platformKeys ?? [],
    lastChangedDate: secrets?.lastChangedDate
  }
}

export { transformSecrets }
