import { sortByName } from '~/src/server/common/helpers/sort-by-name'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortByName', () => {
  const serviceNames = deploymentsFixture.map(
    (deployment) => deployment.service
  )

  test('Should provide expected sorting', () => {
    expect(serviceNames.sort(sortByName)).toEqual([
      'cdp-portal-frontend',
      'cdp-self-service-ops',
      'cdp-teams-and-repositories',
      'cdp-teams-and-repositories',
      'cdp-teams-and-repositories'
    ])
  })
})
