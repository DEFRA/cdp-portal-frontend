import { runningServicesListController } from '~/src/server/running-services/controllers/index.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const runningServices = {
  plugin: {
    name: 'running services',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/running-services',
            ...runningServicesListController
          }
        ].map(withTracing)
      )
    }
  }
}

export { runningServices }
