import { sortByName } from '../../../../common/helpers/sort/sort-by-name.js'

/**
 * Transforms buckets for a given environment
 * @param {object | null} bucketsForEnv - The buckets object containing keys and optional pending keys.
 * @returns {object} An object containing:
 *   - serviceBuckets: The filtered and sorted buckets.
 */
function environmentBuckets(bucketsForEnv) {
  return {
    buckets: bucketsForEnv?.buckets.sort(sortByName),
    isBucketsSetup: bucketsForEnv !== null
  }
}

export { environmentBuckets }
