import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where'
import { transformWithEnvironments } from '~/src/app/running-services/transformers/transform-with-environments'

describe('#transformWithEnvironments', () => {
  test('Should provide expected running services transformation', () => {
    expect(transformWithEnvironments(whatsRunningWhereFixture)).toEqual({
      'cdp-portal-frontend': {
        development: '0.2.0',
        dockerImage:
          '333333333.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        sandbox: '0.2.0',
        testing: '0.2.0'
      },
      'cdp-teams-and-repositories': {
        development: '0.2.0',
        dockerImage:
          '222222222.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
        preProduction: '0.2.0',
        production: '0.2.0',
        sandbox: '0.2.0',
        testing: '0.2.0'
      }
    })
  })
})
