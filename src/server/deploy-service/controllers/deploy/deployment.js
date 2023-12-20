const deploymentController = {
  handler: (request, h) => {
    return h.view('deploy-service/views/deployment', {
      pageTitle: 'Deploy Service deployment',
      heading: 'Deployment',
      headingCaption: 'Your deployments progress'
    })
  }
}

export { deploymentController }
