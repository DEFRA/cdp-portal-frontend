import { runningServicesFixture } from '~/src/__fixtures__/running-services'
import { transformRunningServicesToEntityRow } from '~/src/server/services/transformers/transform-running-services-to-entity-row'

describe('#transformRunningServicesToEntityRow', () => {
  test('Should provide expected running services transformation', () => {
    expect(transformRunningServicesToEntityRow(runningServicesFixture)).toEqual(
      [
        [
          {
            kind: 'text',
            value: '0.2.0'
          },
          {
            kind: 'text',
            value: '0.1.0'
          },
          {
            kind: 'text',
            value: '0.6.0'
          },
          {
            kind: 'text',
            value: '0.4.0'
          },
          {
            kind: 'text',
            value: '0.3.0'
          },
          {
            kind: 'text',
            value: '0.7.0'
          },
          {
            kind: 'text',
            value: '0.2.0'
          }
        ],
        [
          {
            kind: 'text',
            value: '0.6.0'
          },
          {
            kind: 'text',
            value: '1.1.0'
          },
          {
            kind: 'text',
            value: '0.4.0'
          },
          {
            kind: 'text',
            value: '0.9.0'
          },
          {
            kind: 'text',
            value: '0.3.1'
          },
          {
            kind: 'text',
            value: '0.8.0'
          },
          {
            kind: 'text',
            value: '2.2.1'
          }
        ]
      ]
    )
  })
})
