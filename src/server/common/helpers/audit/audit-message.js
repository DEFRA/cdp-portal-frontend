function auditMessage({ event, data, user }) {
  return {
    event,
    ...(data && { data }),
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
