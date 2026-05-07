export const adminCreateController = {
  options: {
    id: 'admin/create'
  },
  handler: async (request, h) => {
    return h.view('admin/create/views/create', {
      pageTitle: 'Create tenant resources'
    })
  }
}
