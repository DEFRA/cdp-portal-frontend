/**
 * @satisfies Partial<@import('@hapi/hapi).ServerRoute>
 */
const healthController = {
  handler: (request, h) => h.response({ message: 'success' }).code(200)
}

export { healthController }
