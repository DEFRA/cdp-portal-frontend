import { transformServicesToEntityRows } from '~/src/server/running-services/transformers/transform-services-to-entity-rows'
import { runningServicesFixture } from '~/src/__fixtures__/running-services'

describe('#transformServicesToEntityRows', () => {
  test('Should provide expected running services transformation', () => {
    expect(transformServicesToEntityRows(runningServicesFixture)).toEqual([
      [
        {
          kind: 'text',
          value: 'cdp-portal-frontend'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
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
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: '0.2.0'
        }
      ]
    ])
  })
})
