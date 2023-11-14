function userHasTeamScope(authedUser) {
  return (scope) => authedUser && authedUser?.scope?.includes(scope)
}

function userHasTeamScopeDecorator(request) {
  return async function hasTeamScope(scope) {
    const authedUser = await request.getUserSession()

    return authedUser && authedUser?.scope?.includes(scope)
  }
}

export { userHasTeamScopeDecorator, userHasTeamScope }
