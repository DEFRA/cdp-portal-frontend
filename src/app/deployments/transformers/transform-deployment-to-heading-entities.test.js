import { transformDeploymentToHeadingEntities } from '~/src/app/deployments/transformers/transform-deployment-to-heading-entities'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentToHeadingEntities', () => {
  test('Should provide expected deployed service heading entities transformation', () => {
    expect(
      transformDeploymentToHeadingEntities(deploymentsFixture.at(0))
    ).toEqual({
      primary: [
        {
          classes: 'govuk-tag--blue',
          kind: 'tag',
          size: 'small',
          value: 'Production'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          size: 'small',
          value: 'RUNNING'
        },
        {
          kind: 'text',
          label: 'Version',
          size: 'small',
          value: '0.2.0'
        }
      ],
      secondary: [
        {
          kind: 'text',
          label: 'Deployed by',
          size: 'small',
          value: 'RoboCop'
        },
        {
          kind: 'date',
          label: 'On',
          size: 'large',
          value: '2023-05-18T21:54:12Z'
        }
      ]
    })
  })
})
