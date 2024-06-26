import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortByName', () => {
  const serviceNames = deploymentsFixture.data.map(
    (deployment) => deployment.service
  )

  test('Should provide expected sorting', () => {
    expect(serviceNames.sort(sortByName)).toEqual([
      'cdp-portal-backend',
      'cdp-portal-frontend',
      'cdp-self-service-ops',
      'cdp-user-service-backend'
    ])
  })
})
