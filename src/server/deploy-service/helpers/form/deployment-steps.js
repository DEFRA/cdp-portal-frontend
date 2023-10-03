import { config } from '~/src/config'

const deploymentUrls = {
  stepOne: config.get('appPathPrefix') + '/deploy-service/details',
  stepTwo: config.get('appPathPrefix') + '/deploy-service/options',
  stepThree: config.get('appPathPrefix') + '/deploy-service/summary',
  stepFour: config.get('appPathPrefix') + '/deploy-service/deploy'
}

const deploymentSteps = (requestPath, urls, isComplete) => [
  {
    isComplete: isComplete.stepOne,
    isCurrent: requestPath.includes(urls.stepOne),
    text: 'Details'
  },
  {
    isComplete: isComplete.stepTwo,
    isCurrent: requestPath.includes(urls.stepTwo),
    text: 'Options'
  },
  {
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
