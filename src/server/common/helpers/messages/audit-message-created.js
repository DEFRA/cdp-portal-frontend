function auditMessageCreated(repositoryKind, repository, userDetails) {
  const user = {
    id: userDetails.id,
    email: userDetails.email,
    displayName: userDetails.displayName
  }
  const message = `${repositoryKind} created: ${repository} by ${user.id}:${user.email}`
  return {
    message,
    repository,
    user
  }
}

export { auditMessageCreated }
