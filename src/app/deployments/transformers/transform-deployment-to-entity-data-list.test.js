import { transformDeploymentToEntityDataList } from '~/src/app/deployments/transformers/transform-deployment-to-entity-data-list'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentToEntityDataList', () => {
  test('Should provide expected deployed service data list entities transformation', () => {
    expect(
      transformDeploymentToEntityDataList(deploymentsFixture.at(0))
    ).toEqual([
      {
        entity: {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'RUNNING'
        },
        heading: 'Status'
      },
      {
        entity: {
          classes: 'govuk-tag--blue',
          kind: 'tag',
          value: 'Production'
        },
        heading: 'Environment'
      },
      {
        entity: {
          kind: 'text',
          size: 'small',
          value: '0.2.0'
        },
        heading: 'Version'
      },
      {
        entity: {
          kind: 'text',
          value: 'cdp-teams-and-repositories'
        },
        heading: 'Docker Image name'
      },
      {
        entity: {
          kind: 'text',
          size: 'small',
          value: 'RoboCop'
        },
        heading: 'Deployed by'
      },
      {
        entity: {
          kind: 'date',
          size: 'large',
          value: '2023-05-18T21:54:12Z'
        },
        heading: 'Deployment date'
      }
    ])
  })
})
