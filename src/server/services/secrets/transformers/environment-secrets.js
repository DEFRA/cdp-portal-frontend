import { pullAll } from 'lodash'

import { config } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { platformKeyDescriptions } from '~/src/server/common/constants/platform-key-descriptions'
import { noValue } from '~/src/server/common/constants/no-value'

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

  const pendingSecretKeys = transformPending(secrets?.pending)

  const serviceSecrets = {
    ...secrets,
    keys: combinePendingKeys(
      secrets,
      platformGlobalSecretKeys,
      pendingSecretKeys
    )
  }

  const platformSecrets = includePlatformSecrets(
    secrets,
    platformGlobalSecretKeys
  )

  const shouldPoll = pendingSecretKeys.length > 0 && !exceptionMessage
  const successMessage =
    pendingSecretKeys.length === 0 && !exceptionMessage
      ? 'Secret added and now available'
      : null

  const isSecretsSetup =
    secrets &&
    (secrets.lastUpdated !== undefined ||
      secrets.keys?.length > 0 ||
      secrets.pending?.length > 0)

  return {
    serviceSecrets,
    platformSecrets,
    shouldPoll,
    successMessage,
    exceptionMessage,
    isSecretsSetup
  }
}

function withoutExcludedKeys(secrets, platformGlobalSecretKeys) {
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

  return secretsWithOutExcludedKeys
}

function transformPending(pending) {
  return pending?.map((key) => ({ key, status: 'pending' })) ?? []
}

function sortCombinedKeys(keys, otherKeys) {
  return [...keys, ...otherKeys].sort(sortBy('key', 'asc'))
}

function combinePendingKeys(secrets, platformGlobalSecretKeys, otherKeys) {
  const trimmedKeys = withoutExcludedKeys(secrets, platformGlobalSecretKeys)
  return sortCombinedKeys(trimmedKeys, otherKeys)
}

function includePlatformSecrets(secrets, keys) {
  return keys
    .map(
      (key) =>
        secrets?.keys?.includes(key) && {
          key,
          description: platformKeyDescriptions[key] ?? noValue
        }
    )
    .filter(Boolean)
    .sort(sortBy('key', 'asc'))
}

export { environmentSecrets }
