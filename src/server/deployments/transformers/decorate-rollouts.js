function decorateRollouts({ deployableServices, userScopeUUIDs }) {
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
        isOwner: teams.some((team) => userScopeUUIDs.includes(team.teamId)),
        ...rollout,
        kind: deployment ? 'deployment' : 'migration'
      }
    })
}

export { decorateRollouts }
