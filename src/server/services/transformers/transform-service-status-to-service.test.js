import { config } from '~/src/config'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'

const githubOrg = config.get('githubOrg')

describe('#transformServiceStatusToService', () => {
  test('Should provide expected create service status to service transformation', () => {
    expect(
      transformServiceStatusToService(createServiceStatusFixture?.status)
    ).toEqual({
      githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      id: 'cdp-portal-frontend',
      isCreateStatus: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: createServiceStatusFixture?.status,
      teams: ['cdp-platform']
    })
  })
})
