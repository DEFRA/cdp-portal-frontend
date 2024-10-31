import { config } from '~/src/config/index.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'

/**
 * Transforms and filters secrets for all environments.
 * @param {object} environments - An object containing environment names as keys.
 * @param {object} allSecrets - An object containing all secrets, keyed by environment.
 * @param {string[]} [platformGlobalSecretKeys] - An array of global secret keys to be excluded from the result,
 * defaults to config.get('platformGlobalSecretKeys').
 * @returns {object} An object containing the filtered and sorted secrets for each environment.
 */
function allEnvironmentSecrets(
  environments,
  allSecrets,
  platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')
) {
  const result = {}
  const excludedKeys = ['automated_placeholder', 'placeholder']

  for (const environment of Object.values(environments)) {
    const secrets = allSecrets[environment]

    if (secrets) {
      result[environment] = {
        isSecretsSetup: true,
        ...secrets,
        keys:
          secrets.keys
            ?.filter(
              (key) =>
                !platformGlobalSecretKeys.includes(key) &&
                !excludedKeys.includes(key)
            )
            .sort(sortByName) ?? [],
        platformKeys:
          platformGlobalSecretKeys
            ?.filter((key) => secrets?.keys?.includes(key))
            .sort(sortByName) ?? []
      }
    } else {
      result[environment] = {
        isSecretsSetup: false
      }
    }
  }

  return result
}

export { allEnvironmentSecrets }
