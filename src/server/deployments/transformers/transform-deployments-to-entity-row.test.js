import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentsToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(
      transformDeploymentsToEntityRow(deploymentsFixture.deployments.at(0))
    ).toEqual([
      {
        kind: 'link',
        url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
        value: 'cdp-self-service-ops'
      },
      {
        kind: 'text',
        value: '0.133.0'
      },
      {
        classes: 'govuk-tag--green',
        kind: 'tag',
        value: 'deployed'
      },
      {
        kind: 'text',
        value: 'B. A. Baracus'
      },
      {
        formatString: 'k:mm:ss EE do MMM yyyy',
        kind: 'date',
        value: '2023-12-14T14:10:49Z'
      }
    ])
  })
})
