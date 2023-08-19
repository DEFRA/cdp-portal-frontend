function isDeploymentComplete(deployment) {
  return {
    stepOne: Boolean(
      deployment?.imageName && deployment?.version && deployment?.environment
    ),
    stepTwo: Boolean(
      deployment?.instanceCount >= 0 && deployment?.cpu && deployment?.memory
    ),
    stepThree: Boolean(deployment?.isSent),
    stepFour: Boolean(deployment?.isComplete)
  }
}

export { isDeploymentComplete }
