function auditMessageCreated(repositoryKind, repository, user) {
  return {
    event: `${repositoryKind} created: ${repository} by ${user.id}:${user.email}`,
    data: { repository },
    user
  }
}

export { auditMessageCreated }
