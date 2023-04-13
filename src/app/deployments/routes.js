const deployments = {
  method: 'GET',
  path: '/deployments',
  options: {
    handler: async (request, hapi) => {
      return hapi.view('deployments/index', {
        pageTitle: 'Deployments',
        heading: 'Deployments'
      })
    }
  }
}

export { deployments }
