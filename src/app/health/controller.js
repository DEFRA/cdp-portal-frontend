const healthController = {
  handler: (request, h) => {
    return h.response({ message: 'Healthy' }).code(200)
  }
}

export { healthController }
