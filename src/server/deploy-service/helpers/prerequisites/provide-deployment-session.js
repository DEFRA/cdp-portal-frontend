const provideDeploymentSession = {
  method: (request) => request.yar.get('deployment'),
  assign: 'deploymentSession'
}

export { provideDeploymentSession }
