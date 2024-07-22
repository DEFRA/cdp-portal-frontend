async function auditCreated(request, repositoryKind, repositoryName) {
  request.audit.send(
    `${repositoryKind} created: ${repositoryName} by ${request.pre?.authedUser.id}:${request.pre?.authedUser.email}`
  )
}

export { auditCreated }
