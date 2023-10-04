import { config } from '~/src/config'

const teamUrls = {
  stepOne: config.get('appPathPrefix') + '/admin/teams/team-details',
  stepTwo: config.get('appPathPrefix') + '/admin/teams/find-github-team',
  stepThree: config.get('appPathPrefix') + '/admin/teams/summary'
}

const teamSteps = (requestPath, urls, isComplete) => [
  {
    isComplete: isComplete.stepOne,
    isCurrent: requestPath.includes(urls.stepOne),
    text: 'Details'
  },
  {
    isComplete: isComplete.stepTwo,
    isCurrent: requestPath.includes(urls.stepTwo),
    text: 'Github team'
  },
  {
    isComplete: isComplete.allSteps,
    isCurrent: requestPath.includes(urls.stepThree),
    text: 'Summary'
  }
]

function isCdpTeamComplete(cdpTeam) {
  return {
    stepOne: cdpTeam?.isComplete?.stepOne,
    stepTwo: cdpTeam?.isComplete?.stepTwo,
    stepThree: cdpTeam?.isComplete?.allSteps
  }
}

export { teamUrls, teamSteps, isCdpTeamComplete }
