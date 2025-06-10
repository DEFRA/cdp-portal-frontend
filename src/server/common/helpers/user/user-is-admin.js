function userIsAdmin(authedUser) {
  return authedUser.isAdmin
}

function userIsAdminDecorator(request) {
  return async () => {
    const authedUser = await request.getUserSession()

    return authedUser ? userIsAdmin(authedUser) : false
  }
}

export { userIsAdminDecorator, userIsAdmin }
