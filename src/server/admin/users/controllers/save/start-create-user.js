export const startCreateUserController = {
  options: {
    id: 'admin/users/create'
  },
  handler: async (request, h) => {
    await request.app.initStepData()
    return h.redirect('/admin/users/add')
  }
}
