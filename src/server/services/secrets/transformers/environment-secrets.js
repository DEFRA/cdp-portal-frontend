import pullAll from 'lodash/pullAll.js'

import { config } from '~/src/config/config.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { platformKeyDescriptions } from '~/src/server/common/constants/platform-key-descriptions.js'
import { noValue } from '~/src/server/common/constants/no-value.js'

/**
 * Transforms secrets for a given environment by filtering out platform global keys and placeholders,
 * and categorizing them into service secrets and platform secrets.
 * @param {object | null} secrets - The secrets object containing keys and optional pending keys.
 * @param {string[]} [platformGlobalSecretKeys] - The list of platform global secret keys defaults to config.get('platformGlobalSecretKeys').
 * @returns {object} An object containing:
 *   - serviceSecrets: The filtered and sorted service secrets.
 *   - platformSecrets: The platform secrets with descriptions.
 *   - shouldPoll: A boolean indicating if polling is needed.
 *   - successMessage: A success message if there are no pending secrets and no exception message.
 *   - exceptionMessage: The exception message if present in the secrets.
 */
function environmentSecrets(
  secrets,
  platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')
) {
  const exceptionMessage = secrets?.exceptionMessage

  const secretsCopy = secrets?.keys ? [...secrets.keys] : []
  const excludedKeys = [
    ...platformGlobalSecretKeys,
    'automated_placeholder',
    'placeholder',
    ...(secrets?.pending ? secrets.pending : [])
  ]
  const secretsWithOutExcludedKeys = (
    secrets?.keys ? pullAll(secretsCopy, excludedKeys) : []
  ).map((key) => ({ key, status: 'available' }))

  const pendingSecretKeys =
    secrets?.pending?.map((pendingKey) => ({
      key: pendingKey,
      status: 'pending'
    })) ?? []

  const serviceSecrets = {
    ...secrets,
    keys: [...secretsWithOutExcludedKeys, ...pendingSecretKeys].sort(
      sortBy('key', 'asc')
    )
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

  const shouldPoll = pendingSecretKeys.length > 0 && !exceptionMessage
  const successMessage =
    pendingSecretKeys.length === 0 && !exceptionMessage
      ? 'Secret added and now available'
      : null

  return {
    serviceSecrets,
    platformSecrets,
    shouldPoll,
    successMessage,
    exceptionMessage,
    isSecretsSetup: secrets !== null
  }
}

export { environmentSecrets }
