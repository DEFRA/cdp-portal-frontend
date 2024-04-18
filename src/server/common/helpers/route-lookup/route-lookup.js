import qs from 'qs'

const routeLookup = (server, id, options = {}) => {
  const params = options?.params ?? {}
  const query = options?.query

  const path = server.lookup(id)?.path

  if (!path) {
    throw new Error(`Request route lookup failed, no controller with id: ${id}`)
  }

  const routePath = Object.entries(params).reduce(
    (pathWithParams, [key, value]) =>
      pathWithParams.replace(`{${key}}`, encodeURI(value)),
    path
  )

  return routePath + qs.stringify(query, { addQueryPrefix: true })
}

export { routeLookup }
