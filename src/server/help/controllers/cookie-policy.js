const serverExtensionPoint = (extName) => (request, h) => {
  request.logger.info(`Call from ${extName} extension point`)

  return h.continue
}

const cookiePolicy = {
  options: {
    id: 'help/cookies',
    ext: {
      onPreAuth: { method: serverExtensionPoint('onPreAuth') },
      onPostAuth: { method: serverExtensionPoint('onPostAuth') },
      onPreHandler: { method: serverExtensionPoint('onPreHandler') },
      onPostHandler: { method: serverExtensionPoint('onPostHandler') },
      onPreResponse: { method: serverExtensionPoint('onPreResponse') }
    }
  },
  handler: (_request, h) =>
    h.view('help/views/cookie-policy', {
      pageTitle: 'Cookie policy'
    })
}

export { cookiePolicy }
