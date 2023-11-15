import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentsToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(transformDeploymentsToEntityRow(deploymentsFixture.at(0))).toEqual([
      {
        kind: 'link',
        url: '/deployments/production/553E4E6B-05D7-4A2E-BF80-02ED34DEF864',
        value: 'cdp-teams-and-repositories'
      },
      {
        kind: 'text',
        value: '0.2.0'
      },
      {
        classes: 'govuk-tag--green',
        kind: 'tag',
        value: 'RUNNING'
      },
      {
        kind: 'text',
        value: 'RoboCop'
      },
      {
        formatString: 'k:mm:ss EE do MMM yyyy',
        kind: 'date',
        value: '2023-05-18T22:54:12Z'
      }
    ])
  })
})
