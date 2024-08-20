import qs from 'qs'

/**
 * If a route has optional parameters, and the parameter is not provided, remove it from the path
 * @param {string} path
 * @param {Record<string, string>} params
 * @returns {string}
 */
function removeOptionalParams(path, params) {
  const paramKeys = Object.keys(params)
  const optionalParams = path.matchAll(/{(\w+)\??}/g) ?? []
  let result = path

  for (const match of optionalParams) {
    if (!paramKeys.includes(match.at(1))) {
      result = path.replace(match.at(0), '')
    }
  }

  return result
}

function routeLookup(server, id, options = {}) {
  const params = options?.params ?? {}
  const query = options?.query

  const path = server.lookup(id)?.path

  if (!path) {
    throw new Error(`Request route lookup failed, no controller with id: ${id}`)
  }

  const routePath = Object.entries(params).reduce(
    (pathWithParams, [key, value]) => {
      const regex = new RegExp(`{${key}\\??}`, 'gi')
      return pathWithParams.replace(regex, encodeURI(value))
    },
    removeOptionalParams(path, params)
  )

  return routePath + qs.stringify(query, { addQueryPrefix: true })
}

export { routeLookup }
