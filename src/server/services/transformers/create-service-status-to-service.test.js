import { config } from '~/src/config'
import { createServiceStatusToService } from '~/src/server/services/transformers/create-service-status-to-service'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress'

const githubOrg = config.get('githubOrg')

describe('#createServiceStatusToService', () => {
  test('Should provide expected create service status transformation', () => {
    expect(
      createServiceStatusToService(
        createServiceStatusInProgressFixture.repositoryStatus
      )
    ).toEqual({
      githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      id: 'cdp-portal-frontend',
      isCreateService: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: createServiceStatusInProgressFixture.repositoryStatus,
      teams: [
        {
          name: 'Platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
        }
      ]
    })
  })
})
