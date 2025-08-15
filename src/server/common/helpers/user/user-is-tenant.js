function userIsTenant(userSession) {
  return userSession.isTenant
}

function userIsTenantDecorator(request) {
  return async () => {
    const userSession = await request.getUserSession()

    return userSession ? userIsTenant(userSession) : false
  }
}

export { userIsTenantDecorator, userIsTenant }
