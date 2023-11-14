const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: async (request, h) => h.redirect('/')
}

export { loginController }
