const urls = {
  stepOne: '/admin/teams/team-details',
  stepTwo: '/admin/teams/find-github-team',
  stepThree: '/admin/teams/summary'
}

function teamSteps(path, cdpTeam) {
  const isComplete = isCdpTeamComplete(cdpTeam)

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
      text: 'GitHub team'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(urls.stepThree),
      text: 'Summary'
    }
  ]
}

function isCdpTeamComplete(cdpTeam) {
  return {
    stepOne: cdpTeam?.isComplete?.stepOne,
    stepTwo: cdpTeam?.isComplete?.stepTwo,
    stepThree: cdpTeam?.isComplete?.allSteps
  }
}

export { teamSteps, isCdpTeamComplete }
