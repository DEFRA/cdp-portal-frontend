import { deploymentsToEntityRow } from '~/src/server/deployments/transformers/deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'
import { undeploymentsFixture } from '~/src/__fixtures__/undeployments'

describe('#deploymentsToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(deploymentsToEntityRow(deploymentsFixture.data.at(0))).toEqual([
      {
        kind: 'link',
        url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
        value: 'cdp-self-service-ops'
      },
      {
        kind: 'list',
        value: undefined
      },
      {
        kind: 'link',
        newWindow: true,
        url: 'https://github.com/DEFRA/cdp-self-service-ops/releases/tag/0.133.0',
        value: '0.133.0'
      },
      {
        classes: 'govuk-tag--green',
        kind: 'tag',
        value: 'running'
      },
      {
        kind: 'text',
        value: 'B. A. Baracus'
      },
      {
        withSeconds: true,
        kind: 'date',
        value: '2023-12-14T14:04:49Z'
      }
    ])
  })

  test('Should provide deployed service with teams', () => {
    expect(deploymentsToEntityRow(deploymentsFixture.data.at(2))).toEqual([
      {
        kind: 'link',
        url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
        value: 'cdp-portal-backend'
      },
      {
        kind: 'list',
        value: [
          {
            kind: 'link',
            url: '/teams/team1Id',
            value: 'team1'
          },
          {
            kind: 'link',
            url: '/teams/team2Id',
            value: 'team2'
          }
        ]
      },
      {
        kind: 'link',
        newWindow: true,
        url: 'https://github.com/DEFRA/cdp-portal-backend/releases/tag/0.94.0',
        value: '0.94.0'
      },
      {
        classes: 'govuk-tag--green',
        kind: 'tag',
        value: 'running'
      },
      {
        kind: 'text',
        value: 'B. A. Baracus'
      },
      {
        withSeconds: true,
        kind: 'date',
        value: '2023-12-14T13:58:13Z'
      }
    ])
  })

  test('Should show un-deployment events as STOPPED', () => {
    expect(deploymentsToEntityRow(undeploymentsFixture)).toEqual([
      {
        kind: 'link',
        url: '/deployments/infra-dev/3f5dff54-9bea-4a53-830d-96610af8c2b4',
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'list',
        value: undefined
      },
      {
        kind: 'link',
        newWindow: true,
        url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.217.0',
        value: '0.217.0'
      },
      {
        classes: 'govuk-tag--grey',
        kind: 'tag',
        value: 'undeployed'
      },
      {
        kind: 'text',
        value: 'The Terminator'
      },
      {
        withSeconds: true,
        kind: 'date',
        value: '2024-01-17T18:46:36.171Z'
      }
    ])
  })
})
