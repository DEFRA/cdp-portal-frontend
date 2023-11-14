const teamUrls = {
  stepOne: '/admin/teams/team-details',
  stepTwo: '/admin/teams/find-github-team',
  stepThree: '/admin/teams/summary'
}

const teamSteps = (requestPath, urls, isComplete) => [
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
