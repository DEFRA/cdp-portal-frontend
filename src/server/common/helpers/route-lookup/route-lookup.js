import qs from 'qs'

import { removeOptionalParam } from './remove-optional-param.js'

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
    removeOptionalParam(path, params)
  )

  return routePath + qs.stringify(query, { addQueryPrefix: true })
}

export { routeLookup }
