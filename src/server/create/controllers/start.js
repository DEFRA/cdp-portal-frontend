const startController = {
  options: {
    id: 'create'
  },
  handler: async (request, h) => {
    await request.app.initStepData()

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
