import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'

describe('#withEnvironments', () => {
  test('Should provide expected running services transformation', () => {
    expect(withEnvironments(whatsRunningWhereFixture)).toEqual({
      'cdp-portal-frontend': {
        infraDev: '0.356.0'
      },
      'cdp-self-service-ops': {
        management: '0.188.0'
      },
      'cdp-user-service-backend': {
        infraDev: '0.149.0'
      }
    })
  })
})
