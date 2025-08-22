function hasTeamScopeDecorator(request) {
  return ({ scope, teamId }) => {
    const teamScope = request.auth?.credentials?.teamScope ?? []
    return teamScope[teamId]?.includes(scope) ?? false
  }
}

export { hasTeamScopeDecorator }
