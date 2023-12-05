const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary',
  stepFour: '/deploy-service/deploy'
}

function deploymentSteps(path, deployment) {
  const isComplete = isDeploymentComplete(deployment)

  return [
    {
      url: urls.stepOne,
      isComplete: isComplete.stepOne,
      isCurrent: path.includes(urls.stepOne),
      text: 'Details'
    },
    {
      url: urls.stepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(urls.stepTwo),
      text: 'Options'
    },
    {
      url: urls.stepThree,
      isComplete: isComplete.stepThree,
      isCurrent: path.includes(urls.stepThree),
      text: 'Summary'
    },
    {
      isComplete: isComplete.stepFour,
      isCurrent: path.includes(urls.stepFour),
      text: 'Deployment'
    }
  ]
}

function isDeploymentComplete(cdpTeam) {
  return {
    stepOne: cdpTeam?.isComplete?.stepOne,
    stepTwo: cdpTeam?.isComplete?.stepTwo,
    stepThree: cdpTeam?.isComplete?.stepThree,
    stepFour: cdpTeam?.isComplete?.allSteps
  }
}

export { deploymentSteps, isDeploymentComplete }
