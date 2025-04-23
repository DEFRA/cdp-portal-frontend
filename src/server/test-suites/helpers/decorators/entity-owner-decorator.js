function entityOwnerDecorator(userScopeUUIDs) {
  return (entity) => {
    return {
      ...entity,
      isOwner: entity?.teams?.some((team) =>
        userScopeUUIDs.includes(team.teamId)
      )
    }
  }
}

export { entityOwnerDecorator }
