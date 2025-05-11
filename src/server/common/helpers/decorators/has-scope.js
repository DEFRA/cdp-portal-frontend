function hasScopeDecorator(request) {
  return (scope) => {
    const userScopes = request.auth?.credentials?.scope ?? []
    return userScopes.includes(scope)
  }
}

export { hasScopeDecorator }
