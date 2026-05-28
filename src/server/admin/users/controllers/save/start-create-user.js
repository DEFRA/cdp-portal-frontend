const startCreateUserController = {
  options: {
    id: 'admin/users/create'
  },
  handler: async (request, h) => {
    await request.app.initStepData()
    return h.redirect('/admin/users/find-aad-user')
  }
}

export { startCreateUserController }
