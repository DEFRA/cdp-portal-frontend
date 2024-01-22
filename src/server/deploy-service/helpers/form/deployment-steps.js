const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary'
}

function deploymentSteps(path, deployment) {
  const isComplete = isDeploymentComplete(deployment)

  return [
    {
      url: urls.stepOne,
      isComplete: isComplete.stepOne,
      isCurrent: path.endsWith(urls.stepOne),
      text: 'Details'
    },
    {
      url: urls.stepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(urls.stepTwo),
      text: 'Options'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.endsWith(urls.stepThree),
      text: 'Summary'
    }
  ]
}

function isDeploymentComplete(cdpTeam) {
  return {
    stepOne: cdpTeam?.isComplete?.stepOne,
    stepTwo: cdpTeam?.isComplete?.stepTwo,
    stepThree: cdpTeam?.isComplete?.allSteps
  }
}

export { deploymentSteps, isDeploymentComplete }
