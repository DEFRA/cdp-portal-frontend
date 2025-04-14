import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress.js'

describe('#createServiceStatusToService', () => {
  test('Should provide expected create service status transformation', () => {
    expect(
      createServiceStatusToService(createServiceStatusInProgressFixture)
    ).toEqual({
      githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
      id: 'cdp-portal-frontend',
      isCreateService: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: createServiceStatusInProgressFixture,
      teams: [
        {
          name: 'Platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
        }
      ]
    })
  })
})
