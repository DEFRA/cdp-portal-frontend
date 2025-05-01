import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'
import { deploymentsFixture } from '~/src/__fixtures__/deployments/deployments.js'

describe('#sortByName', () => {
  const serviceNames = deploymentsFixture.data.map(
    (deployment) => deployment.service
  )
  const differentCaseServices = [
    'cdp-portal-backend',
    'CDP-PORTAL-FRONTEND',
    'cdp-SELF-service-ops',
    'cdp-user-service-BACKEND',
    'FORMS-RUNNER',
    'AQiE-Front-EnD'
  ]

  test('Should provide expected sorting', () => {
    expect(serviceNames.sort(sortByName)).toEqual([
      'cdp-portal-backend',
      'cdp-portal-frontend',
      'cdp-self-service-ops',
      'cdp-user-service-backend'
    ])
  })

  test('Should provide expected case insensitive sorting', () => {
    expect(differentCaseServices.sort(sortByName)).toEqual([
      'AQiE-Front-EnD',
      'cdp-portal-backend',
      'CDP-PORTAL-FRONTEND',
      'cdp-SELF-service-ops',
      'cdp-user-service-BACKEND',
      'FORMS-RUNNER'
    ])
  })
})
