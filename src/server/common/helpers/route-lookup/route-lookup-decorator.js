import { routeLookup } from '~/src/server/common/helpers/route-lookup'

function routeLookupDecorator(request) {
  const server = request.server

  return (id, params = {}) => routeLookup(server, id, params)
}

export { routeLookupDecorator }
