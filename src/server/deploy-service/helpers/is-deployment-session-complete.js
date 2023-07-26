function isDeploymentSessionComplete(deploymentSession) {
  return {
    stepOne: Boolean(
      deploymentSession?.imageName &&
        deploymentSession?.version &&
        deploymentSession?.environment
    ),
    stepTwo: Boolean(
      deploymentSession?.instanceCount >= 0 &&
        deploymentSession?.cpu &&
        deploymentSession?.memory
    ),
    stepThree: Boolean(deploymentSession?.isSent),
    stepFour: Boolean(deploymentSession?.isComplete)
  }
}

export { isDeploymentSessionComplete }
