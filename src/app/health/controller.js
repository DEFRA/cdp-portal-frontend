const healthController = {
  options: {
    auth: {
      mode: 'optional'
    }
  },
  handler: (request, h) => {
    return h.response({ message: 'Healthy' }).code(200)
  }
}

export { healthController }
