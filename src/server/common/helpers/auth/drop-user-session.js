function dropUserSession() {
  if (this?.state?.userSessionCookie?.sessionId) {
    this.server.session.drop(this.state.userSessionCookie.sessionId)
  }
}

export { dropUserSession }
