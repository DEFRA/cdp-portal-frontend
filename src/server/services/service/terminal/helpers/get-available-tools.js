import { scopes } from '@defra/cdp-validation-kit'

export function getAvailableTools(entity, environment, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)
  const env = entity.environments?.[environment] ?? {}
  const hasPostgres = Boolean(env.sql_database?.arn)
  const hasMongo = Boolean(env.tenant_config?.mongo)

  const canUseDatabaseWeb =
    isAdmin || userScopes.includes('permission:betaTester')

  const tools = [{ tool: 'terminal', canLaunchLatest: isAdmin }]

  if (canUseDatabaseWeb && hasPostgres) {
    tools.push({ tool: 'pgweb', canLaunchLatest: isAdmin })
  }

  if (canUseDatabaseWeb && hasMongo) {
    tools.push({ tool: 'dbgate', canLaunchLatest: isAdmin })
  }

  return tools
}
