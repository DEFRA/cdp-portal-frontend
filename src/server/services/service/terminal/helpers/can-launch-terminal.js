import Boom from '@hapi/boom'

import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { environments } from '../../../../../config/environments.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

// TODO finish up and also enable team or user for this abstract better and wrap with tests
function terminalEnvironments(userScopes, teamIds = []) {
  const hasTeamBasedProdAccess = teamIds.some((teamId) =>
    userScopes.includes(`${scopes.prodAccess}:team:${teamId}`)
  )

  return getEnvironments(userScopes).filter((env) => {
    return hasTeamBasedProdAccess || env !== environments.prod.kebabName
  })
}

function canLaunchTerminal(scope, environment) {
  if (!terminalEnvironments(scope).includes(environment)) {
    throw Boom.forbidden('Cannot launch terminal in this environment')
  }
}

export { canLaunchTerminal, terminalEnvironments }
