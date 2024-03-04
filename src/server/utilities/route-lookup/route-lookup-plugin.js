const {
  routeLookup
} = require('~/src/server/utilities/route-lookup/route-lookup')

const routeLookupPlugin = {
  name: 'route-lookup',
  version: '1.0.0',

  register: async function (server) {
    server.decorate('request', 'routeLookup', (id, params = {}) => {
      return routeLookup(server, id, params)
    })
  }
}

export { routeLookupPlugin }
