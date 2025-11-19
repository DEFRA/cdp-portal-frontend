import {
  servicesListController, servicesListV2Controller,
  staticServicesListController
} from './controller.js'

const listServices = {
  plugin: {
    name: 'listServices',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/services',
          ...servicesListController
        },
        {
          method: 'GET',
          path: '/services-inline',
          ...servicesListV2Controller
        },
        {
          method: 'GET',
          path: '/services-static',
          ...staticServicesListController
        }
      ])
    }
  }
}

export { listServices }
