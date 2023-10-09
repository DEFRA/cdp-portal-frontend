const provideAuthedUser = {
  method: async (request) => await request.getUserSession(),
  assign: 'authedUser'
}

export { provideAuthedUser }
