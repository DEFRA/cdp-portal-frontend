import Boom from '@hapi/boom'
import { environments } from '~/src/config/index.js'

const allEnvironmentsOnlyForAdmin = {
  method: async (request, h) => {
    const authedUser = await request.getUserSession()
    const environment = request.params.environment
    const notAllowed = [environments.management, environments.infraDev]

    if (!authedUser?.isAdmin && notAllowed.includes(environment)) {
      throw Boom.boomify(Boom.unauthorized())
    }

    return h.continue
  }
}

export { allEnvironmentsOnlyForAdmin }
