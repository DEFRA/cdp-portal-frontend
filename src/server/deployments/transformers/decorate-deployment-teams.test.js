import { decorateDeploymentTeams } from '~/src/server/deployments/transformers/decorate-deployment-teams'

describe('#decorateDeploymentTeams', () => {
  const deployedService = {
    cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
    service: 'cdp-self-service-ops',
    version: '0.133.0'
  }

  test('Should decorate with teams if service has teams', () => {
    const services = [
      {
        name: 'cdp-self-service-ops',
        teams: ['team1', 'team2']
      }
    ]
    expect(decorateDeploymentTeams(deployedService, services)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      teams: ['team1', 'team2']
    })
  })

  test('Should not decorate with teams if none present', () => {
    const services = [
      {
        name: 'cdp-self-service-ops'
      }
    ]
    expect(decorateDeploymentTeams(deployedService, services)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      teams: []
    })
  })

  test('Should not decorate with teams if no service matches', () => {
    const services = [
      {
        name: 'not-self-service-ops',
        teams: ['team1', 'team2']
      }
    ]
    expect(decorateDeploymentTeams(deployedService, services)).toEqual({
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      teams: []
    })
  })
})
