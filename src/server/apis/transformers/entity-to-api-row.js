function entityToApiRow(entity, environments, runningEnvsByService) {
  const runningEnvs = runningEnvsByService[entity.name] ?? new Set()

  const envLinks = Object.fromEntries(
    environments
      .filter((environment) => runningEnvs.has(environment))
      .map((environment) => [
        environment,
        `https://cdp-api-hub.${environment}.cdp-int.defra.cloud/hub/internal/${entity.name}`
      ])
  )

  const teams = entity.teams?.map((team) => team.name).join(', ') ?? ''
  const format = entity.metadata?.api_docs?.doc_type

  return {
    serviceName: entity.name,
    teams,
    format,
    envLinks,
    hasLinks: Object.keys(envLinks).length > 0
  }
}

export { entityToApiRow }
