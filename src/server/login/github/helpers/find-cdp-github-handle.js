async function findCdpGithubHandle(request) {
  const { profile } = request.auth.credentials
  const { user } = await request.server.methods.fetchCdpUser(profile.id)
  return user.github
}

export { findCdpGithubHandle }
