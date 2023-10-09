function dropUserSession() {
  return this.server.app.cache.drop(this.state.userSession.sessionId)
}

export { dropUserSession }
