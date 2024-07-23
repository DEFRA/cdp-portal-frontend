function auditMessageCreated(repositoryKind, repository, user) {
  return {
    event: `${repositoryKind} created: ${repository} by ${user.id}:${user.email}`,
    repository,
    user
  }
}

export { auditMessageCreated }
