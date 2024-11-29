import Boom from '@hapi/boom'

import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { environments } from '~/src/config/environments.js'

function canLaunchTerminal(request, environment) {
  const envs = getEnvironments(request.auth.credentials?.scope).filter(
    (env) => env !== environments.prod.kebabName
  )

  if (!envs.includes(environment)) {
    throw Boom.forbidden('Cannot launch terminal in this environment')
  }
}

export { canLaunchTerminal }
