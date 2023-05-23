import { transformDeploymentToHeadingEntities } from '~/src/app/deployments/transformers/transform-deployment-to-heading-entities'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentToHeadingEntities', () => {
  test('Should provide expected deployed service heading entities transformation', () => {
    expect(
      transformDeploymentToHeadingEntities(deploymentsFixture.at(0))
    ).toEqual(
      expect.objectContaining({
        primary: expect.arrayContaining([
          expect.objectContaining({
            classes: 'govuk-tag--blue',
            kind: 'tag',
            size: 'small',
            value: 'Production'
          }),
          expect.objectContaining({
            classes: 'govuk-tag--green',
            kind: 'tag',
            size: 'small',
            value: 'RUNNING'
          }),
          expect.objectContaining({
            kind: 'text',
            label: 'Version',
            size: 'small',
            value: '0.2.0'
          })
        ]),
        secondary: expect.arrayContaining([
          expect.objectContaining({
            kind: 'text',
            label: 'Deployed by',
            size: 'small',
            value: 'RoboCop'
          }),
          expect.objectContaining({
            kind: 'date',
            label: 'On',
            size: 'large',
            value: '2023-05-18T21:54:12Z'
          })
        ])
      })
    )
  })
})
