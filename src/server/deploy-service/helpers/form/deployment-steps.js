const deploymentUrls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary',
  stepFour: '/deploy-service/deploy'
}

const deploymentSteps = (requestPath, urls, isComplete) => [
  {
    url: urls.stepOne,
    isComplete: isComplete.stepOne,
    isCurrent: requestPath.includes(urls.stepOne),
    text: 'Details'
  },
  {
    url: urls.stepTwo,
    isComplete: isComplete.stepTwo,
    isCurrent: requestPath.includes(urls.stepTwo),
    text: 'Options'
  },
  {
    url: urls.stepThree,
    isComplete: isComplete.stepThree,
    isCurrent: requestPath.includes(urls.stepThree),
    text: 'Summary'
  },
  {
    isComplete: isComplete.stepFour,
    isCurrent: requestPath.includes(urls.stepFour),
    text: 'Deployment'
  }
]

function isDeploymentComplete(cdpTeam) {
  return {
    stepOne: cdpTeam?.isComplete?.stepOne,
    stepTwo: cdpTeam?.isComplete?.stepTwo,
    stepThree: cdpTeam?.isComplete?.stepThree,
    stepFour: cdpTeam?.isComplete?.allSteps
  }
}

export { deploymentUrls, deploymentSteps, isDeploymentComplete }
