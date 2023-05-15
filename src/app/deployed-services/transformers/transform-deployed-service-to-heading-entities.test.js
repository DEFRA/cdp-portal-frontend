import { transformDeployedServiceToHeadingEntities } from '~/src/app/deployed-services/transformers/transform-deployed-service-to-heading-entities'
import { deployedServicesFixture } from '~/src/__fixtures__/deployed-services'

describe('#transformDeploymentToHeadingEntities', () => {
  test('Should provide expected deployed service heading entities transformation', () => {
    expect(
      transformDeployedServiceToHeadingEntities(deployedServicesFixture.at(0))
    ).toEqual(
      expect.objectContaining({
        primary: expect.arrayContaining([
          expect.objectContaining({
            classes: 'govuk-tag--blue',
            kind: 'tag',
            size: 'small',
            value: 'production'
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
            value: '1.0.0'
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
            value: '2023-04-11T14:40:02.242Z'
          })
        ])
      })
    )
  })
})
