import * as globals from '../src/config/nunjucks/globals/globals.js'
import { getAssetPath } from '../src/config/nunjucks/context/context.js'

/**
 * Ideally minmise mocks or creating test version of context or globals. But if you need to...
 * This file is the place to put test/mocked context or globals that are used in the Nunjucks templates whilst testing
 */

/**
 * Test version of get asset path. Same as app one, but the url references local assets. You need to have run the
 * build command to have the assets available. Which is automatically done via the `pretest` npm script
 * @param {string} asset
 * @returns {string}
 */
function getTestAssetPath(asset) {
  const assetPath = getAssetPath(asset)
  return assetPath.replace(/^\//, '/.')
}

/**
 * Test version of routeLookup. This returns the id so links using routeLookup in tests will have the id as their href
 * @param {string} id
 * @returns {string}
 */
const routeLookup = (id) => id

export const testGlobals = {
  ...globals,
  getAssetPath: getTestAssetPath,
  routeLookup
}
