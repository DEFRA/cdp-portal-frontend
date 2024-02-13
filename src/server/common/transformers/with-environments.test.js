import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'

describe('#withEnvironments', () => {
  test('Should provide expected running services transformation', () => {
    expect(withEnvironments(whatsRunningWhereFixture)).toEqual({
      'cdp-portal-frontend': {
        development: '0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        testing: '0.2.0'
      },
      'cdp-teams-and-repositories': {
        development: '0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        testing: '0.2.0'
      }
    })
  })
})
