function auditMessageCreated(repositoryKind, repositoryName, user) {
  return `${repositoryKind} created: ${repositoryName} by ${user?.id}:${user?.email}`
}

export { auditMessageCreated }
