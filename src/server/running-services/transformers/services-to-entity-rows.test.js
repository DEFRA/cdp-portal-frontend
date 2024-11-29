import { servicesToEntityRows } from '~/src/server/running-services/transformers/services-to-entity-rows.js'
import { runningServicesFixture } from '~/src/__fixtures__/running-services.js'

describe('#servicesToEntityRows', () => {
  test('Should provide expected running services transformation', () => {
    expect(
      servicesToEntityRows([
        'infra-dev',
        'management',
        'dev',
        'test',
        'perf-test',
        'prod'
      ])(runningServicesFixture)
    ).toEqual([
      [
        {
          kind: 'text',
          value: 'cdp-portal-frontend'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.6.0 - Infra-dev',
          value: '0.6.0'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.1.0 - Management',
          value: '0.1.0'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.4.0 - Dev',
          value: '0.4.0'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.3.0 - Test',
          value: '0.3.0'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.7.0 - Perf-test',
          value: '0.7.0'
        },
        {
          kind: 'text',
          title: 'cdp-portal-frontend - 0.2.0 - Prod',
          value: '0.2.0'
        }
      ],
      [
        {
          kind: 'text',
          value: 'cdp-teams-and-repositories'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 0.4.0 - Infra-dev',
          value: '0.4.0'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 1.1.0 - Management',
          value: '1.1.0'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 0.9.0 - Dev',
          value: '0.9.0'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 0.3.1 - Test',
          value: '0.3.1'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 0.8.0 - Perf-test',
          value: '0.8.0'
        },
        {
          kind: 'text',
          title: 'cdp-teams-and-repositories - 2.2.1 - Prod',
          value: '2.2.1'
        }
      ]
    ])
  })
})
