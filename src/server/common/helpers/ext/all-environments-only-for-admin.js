import Boom from '@hapi/boom'
import { getEnvironmentsThatNeed } from '../environments/get-environments.js'
import { scopes } from '../../constants/scopes.js'

const allEnvironmentsOnlyForAdmin = {
  method: async (request, h) => {
    const authedUser = await request.getUserSession()
    const environment = request.params.environment

    const adminOnlyEnvs = getEnvironmentsThatNeed([scopes.admin])

    if (!authedUser?.isAdmin && adminOnlyEnvs.includes(environment)) {
      throw Boom.boomify(Boom.unauthorized())
    }

    return h.continue
  }
}

export { allEnvironmentsOnlyForAdmin }
