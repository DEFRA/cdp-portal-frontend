import { environments, scopes } from '@defra/cdp-validation-kit'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { userIsAdminOrBetaTester } from '#server/common/helpers/user/user-is-admin-or-beta-tester.js'

export function allowedBreakGlassEnvironments({ userScopes, teams, entity }) {
  const envs = getEnvironments(userScopes)
  const teamIds = teams.map(({ teamId }) => teamId)
  const hasTeamBasedBreakGlass = teamIds.some((teamId) =>
    userScopes.includes(`${scopes.breakGlass}:team:${teamId}`)
  )
  const hasTeamServiceOwner = teamIds.some((teamId) =>
    userScopes.includes(`${scopes.serviceOwner}:team:${teamId}`)
  )
  const canUseWebTools = userIsAdminOrBetaTester(userScopes)
  const hasProdDlqs = Boolean(
    entity?.environments?.[environments.prod]?.sqs_queues?.some((queue) =>
      Boolean(queue.deadletter_queue_arn)
    )
  )
  const canUseProdSqsToolWithoutBreakGlass =
    hasTeamServiceOwner && canUseWebTools && hasProdDlqs

  const shouldIncludeEnvironment = (env) =>
    [
      userScopes.includes(scopes.breakGlass),
      hasTeamBasedBreakGlass,
      canUseProdSqsToolWithoutBreakGlass,
      env !== environments.prod
    ].some((e) => e)

  return envs.filter(shouldIncludeEnvironment)
}
