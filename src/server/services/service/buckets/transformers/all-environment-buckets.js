import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'

/**
 * Transforms and filters buckets for all environments.
 * @param {Array} environments - An list of environment names.
 * @param {object} allBuckets - An object containing all buckets, keyed by environment.
 * @returns {object} An object containing the filtered and sorted buckets for each environment.
 */
function allEnvironmentBuckets(environments, allBuckets) {
  const result = {}

  Array.from(environments).forEach(function (environment) {
    const bucketsForEnv = allBuckets?.[environment]

    if (bucketsForEnv) {
      result[environment] = {
        isBucketsSetup: true,
        buckets: bucketsForEnv.buckets
          ? bucketsForEnv.buckets.sort(sortByName)
          : []
      }
    } else {
      result[environment] = {
        isBucketsSetup: false
      }
    }
  })

  return result
}

export { allEnvironmentBuckets }
