function userIsTenant(authedUser) {
  return authedUser.isTenant
}

function userIsTenantDecorator(request) {
  return async () => {
    const authedUser = await request.getUserSession()

    return authedUser ? userIsTenant(authedUser) : false
  }
}

export { userIsTenantDecorator, userIsTenant }
