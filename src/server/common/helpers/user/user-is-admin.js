function userIsAdmin(userSession) {
  return userSession.isAdmin
}

function userIsAdminDecorator(request) {
  return async () => {
    const userSession = await request.getUserSession()

    return userSession ? userIsAdmin(userSession) : false
  }
}

export { userIsAdminDecorator, userIsAdmin }
