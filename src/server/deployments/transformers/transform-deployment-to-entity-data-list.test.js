import { transformDeploymentToEntityDataList } from '~/src/server/deployments/transformers/transform-deployment-to-entity-data-list'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentToEntityDataList', () => {
  test('Should provide expected deployed service data list entities transformation', () => {
    expect(
      transformDeploymentToEntityDataList(deploymentsFixture.deployments.at(0))
    ).toEqual([
      {
        entity: {
          kind: 'text',
          value: 1
        },
        heading: 'Instances'
      },
      {
        entity: {
          kind: 'text',
          value: '1024'
        },
        heading: 'CPU'
      },
      {
        entity: {
          kind: 'text',
          value: '2048'
        },
        heading: 'Memory'
      },
      {
        entity: {
          kind: 'text',
          value: 'cdp-self-service-ops'
        },
        heading: 'Image name'
      },
      {
        entity: {
          kind: 'text',
          size: 'small',
          value: 'B. A. Baracus'
        },
        heading: 'Deployed by'
      },
      {
        entity: {
          kind: 'date',
          size: 'large'
        },
        heading: 'Updated'
      }
    ])
  })
})
