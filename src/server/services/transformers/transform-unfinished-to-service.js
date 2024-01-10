// TODO remove
function transformUnfinishedToService(unfinished) {
  const serviceName = unfinished?.repositoryName
  const team = {
    teamId: unfinished.team.teamId,
    name: unfinished.team.name
  }

  return {
    isUnfinished: true,
    serviceName,
    githubUrl: unfinished?.createRepository?.url,
    id: serviceName,
    teams: [team],
    serviceStatus: unfinished
  }
}

export { transformUnfinishedToService }
