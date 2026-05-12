export async function getSession(sessionId, server) {
  if (sessionId) {
    return server.session?.get(sessionId)
  }
}

export async function setSession(sessionId, session, server) {
  if (sessionId) {
    return server.session?.set(sessionId, session)
  }
}

export async function dropSession(sessionId, server) {
  if (sessionId) {
    return server.session?.drop(sessionId)
  }
}
