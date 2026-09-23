import { scopes } from '@defra/cdp-validation-kit'

export function getAvailableTools(entity, userScopes) {
  const isAdmin = userScopes.includes(scopes.admin)
  const hasPostgres = Object.values(entity.environments).some(
    (env) => env.sql_database?.arn
  )
  const hasMongo = Object.values(entity.environments).some(
    (env) => env.tenant_config?.mongo
  )

  const canUseDatabaseWeb =
    isAdmin || userScopes.includes('team:central-animal-store')

  const tools = [{ text: 'Terminal', value: 'terminal' }]
  if (isAdmin) {
    tools.push({ text: 'Terminal (latest)', value: 'terminal_latest' })
  }

  if (canUseDatabaseWeb && hasPostgres) {
    tools.push({ text: 'Postgres Web UI', value: 'pgweb' })
    if (isAdmin) {
      tools.push({ text: 'Postgres Web UI (latest)', value: 'pgweb_latest' })
    }
  }

  if (canUseDatabaseWeb && hasMongo) {
    tools.push({ text: 'MongoDB Web UI', value: 'dbgate' })
    if (isAdmin) {
      tools.push({ text: 'MongoDB Web UI (latest)', value: 'dbgate_latest' })
    }
  }

  return tools
}
