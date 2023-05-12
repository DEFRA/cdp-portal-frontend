const createServiceFormController = {
  handler: async (request, h) => {
    return h.view('create-service/views/form', {
      pageTitle: 'Create a new micro-service',
      heading: 'Create a new micro-service'
    })
  }
}

export { createServiceFormController }
