import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'

describe('#withEnvironments', () => {
  test('Should provide expected running services transformation', () => {
    expect(withEnvironments(whatsRunningWhereFixture)).toEqual({
      'cdp-portal-frontend': {
        dev: '0.2.0',
        perfTest: '0.2.0',
        prod: '0.2.0',
        test: '0.2.0'
      },
      'cdp-teams-and-repositories': {
        dev: '0.2.0',
        perfTest: '0.2.0',
        prod: '0.2.0',
        test: '0.2.0'
      }
    })
  })
})
