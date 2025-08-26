function decorateRollouts({ deployableServices, userScopes }) {
  return (rollouts) =>
    rollouts?.map(({ deployment, migration }) => {
      const rollout = deployment ?? migration

      const deployableService = deployableServices.find(
        (service) =>
          service.name.toLowerCase() === rollout.service.toLowerCase()
      )

      const teams = deployableService?.teams ?? []

      return {
        teams,
        isOwner: teams.some((team) => userScopes.includes(team.teamId)),
        ...rollout,
        kind: deployment ? 'deployment' : 'migration'
      }
    })
}

export { decorateRollouts }
