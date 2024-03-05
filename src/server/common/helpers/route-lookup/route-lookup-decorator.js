import { routeLookup } from '~/src/server/common/helpers/route-lookup'

function routeLookupDecorator(request) {
  return (id, params = {}) => routeLookup(request.server, id, params)
}

export { routeLookupDecorator }
