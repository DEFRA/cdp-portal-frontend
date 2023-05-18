import { deployedServicesListController } from '~/src/app/deployed-services/controllers'

const deployedServices = {
  plugin: {
    name: 'deployed services',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployed-services',
          ...deployedServicesListController
        }
      ])
    }
  }
}

export { deployedServices }
