import { config } from '~/src/config'
import { transformUnfinishedToService } from '~/src/server/services/transformers/transform-unfinished-to-service'
import { unfinishedServiceStatusFixture } from '~/src/__fixtures__/unfinished-service-status'

const githubOrg = config.get('githubOrg')

describe('#transformUnfinishedToService', () => {
  test('Should provide expected unfinished status service transformation', () => {
    expect(
      transformUnfinishedToService(unfinishedServiceStatusFixture.unfinished)
    ).toEqual({
      githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
      id: 'cdp-portal-frontend',
      isUnfinished: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: unfinishedServiceStatusFixture.unfinished,
      teams: [
        {
          name: 'Platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
        }
      ]
    })
  })
})
