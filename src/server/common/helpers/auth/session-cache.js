export async function getSession(sessionId, server) {
  if (!sessionId || !server.session) {
    return
  }
  return server.session.get(sessionId)
}

export async function setSession(sessionId, session, server) {
  if (!sessionId || !server.session) {
    return
  }
  return server.session.set(sessionId, session)
}

export async function dropSession(sessionId, server) {
  if (!sessionId || !server.session) {
    return
  }
  return server.session.drop(sessionId)
}
