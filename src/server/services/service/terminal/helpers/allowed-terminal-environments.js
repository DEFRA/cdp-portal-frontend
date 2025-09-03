import { scopes } from '@defra/cdp-validation-kit'

import { environments } from '../../../../../config/environments.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'

function allowedTerminalEnvironments({ userScopes, entity }) {
  const envs = getEnvironments(userScopes)
  const teamIds = entity.teams.map(({ teamId }) => teamId)
  const hasTeamBasedBreakGlass = teamIds.some((teamId) =>
    userScopes.includes(`${scopes.breakGlass}:team:${teamId}`)
  )
  const shouldIncludeEnvironment = (env) =>
    [
      userScopes.includes(scopes.breakGlass),
      hasTeamBasedBreakGlass,
      env !== environments.prod.kebabName
    ].some((e) => e)

  return envs.filter(shouldIncludeEnvironment)
}

export { allowedTerminalEnvironments }
