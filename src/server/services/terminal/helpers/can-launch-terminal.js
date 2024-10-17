import Boom from '@hapi/boom'

import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

async function canLaunchTerminal(request, environment) {
  const authedUser = await request.getUserSession()
  const isAdmin = authedUser?.isAdmin

  const environments = Object.values(getEnvironments(isAdmin)).filter(
    (env) => env !== 'prod'
  )

  if (!environments.includes(environment)) {
    throw Boom.forbidden('Cannot launch terminal in this environment')
  }
}

export { canLaunchTerminal }
