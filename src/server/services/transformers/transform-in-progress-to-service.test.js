import { config } from '~/src/config'
import { inProgressServiceStatusFixture } from '~/src/__fixtures__/in-progress-service-status'
import { transformInProgressToService } from '~/src/server/services/transformers/transform-in-progress-to-service'

const githubOrg = config.get('githubOrg')

describe('#transformInProgressToService', () => {
  test('Should provide expected in progress status service transformation', () => {
    expect(
      transformInProgressToService(inProgressServiceStatusFixture.inProgress)
    ).toEqual({
      githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      id: 'cdp-portal-frontend',
      isInProgress: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: inProgressServiceStatusFixture.inProgress,
      teams: [
        {
          name: 'Platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
        }
      ]
    })
  })
})
