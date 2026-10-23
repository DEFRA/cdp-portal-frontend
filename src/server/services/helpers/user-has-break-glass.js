import { scopes } from '@defra/cdp-validation-kit'

export default function userHasBreakGlass(userSession, entity = null) {
  if (userSession?.scope?.includes(scopes.breakGlass)) {
    return true
  }

  const teamIds = entity?.teams?.map(({ teamId }) => teamId)
  const hasTeamBasedBreakGlass = teamIds?.some((teamId) =>
    userSession?.scope?.includes(`${scopes.breakGlass}:team:${teamId}`)
  )

  return hasTeamBasedBreakGlass ?? false
}
