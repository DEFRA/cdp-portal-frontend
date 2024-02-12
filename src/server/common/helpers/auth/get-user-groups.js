async function getUserGroups(request) {
  const authedUser = await request.getUserSession()
  return authedUser.scope
}

export { getUserGroups }
