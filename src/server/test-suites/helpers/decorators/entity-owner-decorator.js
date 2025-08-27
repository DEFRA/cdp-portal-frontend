function entityOwnerDecorator(userScopes) {
  return (entity) => {
    return {
      ...entity,
      isOwner: entity?.teams?.some((team) =>
        userScopes.includes(`team:${team.teamId}`)
      )
    }
  }
}

export { entityOwnerDecorator }
