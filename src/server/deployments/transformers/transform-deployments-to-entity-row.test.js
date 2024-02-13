import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'
import { undeploymentsFixture } from '~/src/__fixtures__/undeployments'

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
        value: '2023-12-14T14:04:49Z'
      }
    ])
  })

  test('Should show un-deployment events as STOPPED', () => {
    expect(transformDeploymentsToEntityRow(undeploymentsFixture)).toEqual([
      {
        kind: 'link',
        url: '/deployments/infra-dev/3f5dff54-9bea-4a53-830d-96610af8c2b4',
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'text',
        value: '0.217.0'
      },
      {
        classes: 'govuk-tag--grey',
        kind: 'tag',
        value: 'stopped'
      },
      {
        kind: 'text',
        value: 'The Terminator'
      },
      {
        formatString: 'k:mm:ss EE do MMM yyyy',
        kind: 'date',
        value: '2024-01-17T18:46:36.171Z'
      }
    ])
  })
})
