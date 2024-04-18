import { routeLookup } from '~/src/server/common/helpers/route-lookup'

function routeLookupDecorator({ server }) {
  return (id, options = {}) => routeLookup(server, id, options)
}

export { routeLookupDecorator }
