import { sortByName } from '../../../../common/helpers/sort/sort-by-name.js'

function environmentResources(bucketsForEnv) {
  return {
    buckets: bucketsForEnv?.buckets.sort(sortByName),
    isBucketsSetup: bucketsForEnv !== null
  }
}

export { environmentResources }
