function userIsTenant(userSession) {
  return userSession.isTenant
}

function userIsTenantDecorator(request) {
  return async () => {
    const userSession = request.auth.credentials

    return userSession ? userIsTenant(userSession) : false
  }
}

export { userIsTenantDecorator, userIsTenant }
