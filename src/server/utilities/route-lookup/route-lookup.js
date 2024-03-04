import qs from 'qs'

const routeLookup = (server, id, params = {}) => {
  let path = server.lookup(id)?.path

  if (!path) {
    throw new Error(`Route lookup failed, no controller with id: ${id}`)
  }

  const queryParams = {}
  Object.keys(params).forEach((k) => {
    const paramKey = '{' + k + '}'
    if (path.includes(paramKey)) {
      path = path.replace(paramKey, encodeURIComponent(params[k])) // TODO: do we need to escape the params?
    } else {
      queryParams[k] = params[k]
    }
  })
  const queryString = qs.stringify(queryParams, { addQueryPrefix: true })
  return path + queryString
}

export { routeLookup }
