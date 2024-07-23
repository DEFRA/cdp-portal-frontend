function auditMessage({ event, repository, user }) {
  return {
    event,
    ...(repository && { repository }),
    ...(user && {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    })
  }
}

export { auditMessage }
