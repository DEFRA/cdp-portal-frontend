import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { environments } from '../../../../../config/environments.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

function terminalEnvironments(scope) {
  return getEnvironments(scope).filter(
    (env) =>
      scope.includes(scopes.breakGlass) || env !== environments.prod.kebabName
  )
}

function canLaunchTerminal(scope, environment) {
  if (!terminalEnvironments(scope).includes(environment)) {
    throw Boom.forbidden('Cannot launch terminal in this environment')
  }
}

export { canLaunchTerminal, terminalEnvironments }
