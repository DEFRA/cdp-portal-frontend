const provideFormValues = {
  method: (request, h) => {
    const response = request.response

    if (response.variety === 'view') {
      if (!response.source?.context) {
        response.source.context = {}
      }

      const query = request.query
      const service = query.service
      const user = query.user
      const status = query.status

      response.source.context.formValues = {
        ...(service && { service }),
        ...(user && { user }),
        ...(status && { status })
      }
    }

    return h.continue
  },
  options: {
    before: ['yar']
  }
}

export { provideFormValues }
