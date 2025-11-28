function userIsAdmin(userSession) {
  return userSession?.isAdmin
}

function userIsAdminDecorator(request) {
  return () => {
    const userSession = request.auth.credentials

    return userSession ? userIsAdmin(userSession) : false
  }
}

export { userIsAdminDecorator, userIsAdmin }
