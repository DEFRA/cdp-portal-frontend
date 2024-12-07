import { routeLookup } from '~/src/server/common/helpers/route-lookup/index.js'

/**
 * @typedef {object} Options
 * @property {Record<string, string>} [query]
 * @property {Record<string, string>} [params]
 */

/**
 *
 * @param {import('@hapi/hapi').Server} server
 * @returns {function(*, {}=): *}
 */
function routeLookupDecorator({ server }) {
  /**
   * @param {string} id
   * @param {Options} [options] = {}
   */
  return (id, options = {}) => routeLookup(server, id, options)
}

export { routeLookupDecorator }
