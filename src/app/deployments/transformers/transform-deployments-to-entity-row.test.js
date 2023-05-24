import { transformDeploymentsToEntityRow } from '~/src/app/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentsToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(transformDeploymentsToEntityRow(deploymentsFixture.at(0))).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/deployments/553E4E6B-05D7-4A2E-BF80-02ED34DEF864',
        value: 'cdp-teams-and-repositories'
      },
      {
        classes: 'govuk-tag--blue',
        kind: 'tag',
        value: 'Production'
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
        kind: 'date',
        value: '2023-05-18T21:54:12Z'
      }
    ])
  })
})
