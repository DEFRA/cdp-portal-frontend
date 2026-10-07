import { scopes } from '@defra/cdp-validation-kit'

export function getAvailableTools(entity, environment, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)
  const hasBetaTester = userScopes.includes('permission:betaTester')
  const env = entity.environments?.[environment] ?? {}
  const hasPostgres = Boolean(env.sql_database?.arn)
  const hasMongo = Boolean(env.tenant_config?.mongo)
  const hasDlq = Boolean(
    env.sqs_queues?.some((queue) => Boolean(queue.deadletter_queue_arn))
  )
  const hasBreakGlass =
    userScopes.includes(scopes.breakGlass) ||
    entity.teams?.some(({ teamId }) =>
      userScopes.includes(`${scopes.breakGlass}:team:${teamId}`)
    )

  const canUseDatabaseWeb = isAdmin || hasBetaTester
  const toolsAllowedWithoutBreakGlass = new Set(['sqs_tool'])

  const tools = [{ tool: 'terminal', canLaunchLatest: isAdmin }]

  if (canUseDatabaseWeb && hasPostgres) {
    tools.push({ tool: 'pgweb', canLaunchLatest: isAdmin })
  }

  if (canUseDatabaseWeb && hasMongo) {
    tools.push({ tool: 'dbgate', canLaunchLatest: isAdmin })
  }

  if (canUseDatabaseWeb && hasDlq) {
    tools.push({ tool: 'sqs_tool', canLaunchLatest: isAdmin })
  }

  if (environment === 'prod' && !hasBreakGlass) {
    return tools.filter(({ tool }) => toolsAllowedWithoutBreakGlass.has(tool))
  }

  return tools
}
