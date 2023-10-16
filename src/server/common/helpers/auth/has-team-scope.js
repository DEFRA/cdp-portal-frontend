function hasTeamScope(authedUser) {
  return (scope) => authedUser && authedUser?.scope?.includes(scope)
}

function hasTeamScopeDecorator(request) {
  return async (scope) => {
    const authedUser = await request.getUserSession()

    return authedUser && authedUser?.scope?.includes(scope)
  }
}

export { hasTeamScope, hasTeamScopeDecorator }
