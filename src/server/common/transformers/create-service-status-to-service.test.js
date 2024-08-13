import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress'

describe('#createServiceStatusToService', () => {
  test('Should provide expected create service status transformation', () => {
    expect(
      createServiceStatusToService(
        createServiceStatusInProgressFixture.repositoryStatus
      )
    ).toEqual({
      githubUrl: '',
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
