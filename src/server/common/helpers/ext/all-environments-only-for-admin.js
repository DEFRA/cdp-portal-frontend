import Boom from '@hapi/boom'
import { getEnvironmentsThatNeed } from '../environments/get-environments.js'
import { scopes } from '@defra/cdp-validation-kit'

const allEnvironmentsOnlyForAdmin = {
  method: async (request, h) => {
    const userSession = await request.getUserSession()
    const environment = request.params.environment

    const adminOnlyEnvs = getEnvironmentsThatNeed([scopes.admin])

    if (!userSession?.isAdmin && adminOnlyEnvs.includes(environment)) {
      throw Boom.boomify(Boom.unauthorized())
    }

    return h.continue
  }
}

export { allEnvironmentsOnlyForAdmin }
