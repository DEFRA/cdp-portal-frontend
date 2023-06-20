import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where'
import { transformWithEnvironments } from '~/src/server/common/transformers/transform-with-environments'

describe('#transformWithEnvironments', () => {
  test('Should provide expected running services transformation', () => {
    expect(transformWithEnvironments(whatsRunningWhereFixture)).toEqual({
      'cdp-portal-frontend': {
        development: '0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        sandbox: '0.2.0',
        testing: '0.2.0'
      },
      'cdp-teams-and-repositories': {
        development: '0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        sandbox: '0.2.0',
        testing: '0.2.0'
      }
    })
  })
})
