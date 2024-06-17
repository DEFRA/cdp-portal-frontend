import { decorateDeploymentTeams } from '~/src/server/deployments/transformers/decorate-deployment-teams'

describe('#decorateDeploymentTeams', () => {
  const deployedService = {
    cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
    service: 'cdp-self-service-ops',
    version: '0.133.0'
  }
  const team1 = {
    teamId: 'team1Id',
    description: 'team1'
  }
  const team2 = {
    teamId: 'team2Id',
    description: 'team2'
  }

  test('Should decorate with teams if service has teams', () => {
    const repositories = [
      {
        id: 'cdp-self-service-ops',
        teams: [team1, team2]
      }
    ]
    expect(decorateDeploymentTeams(deployedService, repositories)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      teams: [team1, team2]
    })
  })

  test('Should not decorate with teams if none present', () => {
    const repositories = [
      {
        id: 'cdp-self-service-ops'
      }
    ]
    expect(decorateDeploymentTeams(deployedService, repositories)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0'
    })
  })

  test('Should not decorate with teams if no service matches', () => {
    const repositories = [
      {
        id: 'not-self-service-ops',
        teams: [team1, team2]
      }
    ]
    expect(decorateDeploymentTeams(deployedService, repositories)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0'
    })
  })
})
