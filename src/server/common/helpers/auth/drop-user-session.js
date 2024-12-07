function dropUserSession() {
  if (this?.state?.userSessionCookie?.sessionId) {
    this.server.app.cache.drop(this.state.userSessionCookie.sessionId)
  }
}

export { dropUserSession }
