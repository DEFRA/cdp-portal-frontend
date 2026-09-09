import { accountDisabledController } from './controller.js'

const accountDisabled = {
  plugin: {
    name: 'account-disabled',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/account-disabled',
          ...accountDisabledController
        }
      ])
    }
  }
}

export { accountDisabled }
