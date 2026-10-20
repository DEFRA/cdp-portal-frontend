import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import * as filters from '#config/nunjucks/filters/filters.js'
import path from 'path'

const environment = nunjucks.configure()

environment.addGlobal('govukRebrand', true)

for (const filter of Object.keys(filters)) {
  environment.addFilter(filter, filters[filter])
}

/*
 * Patch loader due to missing `path` reference
 */
nunjucks.PrecompiledLoader.prototype.resolve = function patchedResolve(
  from,
  to
) {
  const result = path.resolve(path.dirname(from), to)
  return result.startsWith('/') ? result.replace('/', '') : result
}

/*
 * In browser nunjucks
 */
export const nunjucksEnvironment = environment
