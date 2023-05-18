import { transformDeployedServicesToEntityRow } from '~/src/app/deployed-services/transformers/transform-deployed-services-to-entity-row'
import { deployedServicesFixture } from '~/src/__fixtures__/deployed-services'

describe('#transformDeployedServicesToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(
      transformDeployedServicesToEntityRow(deployedServicesFixture.at(0))
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'text',
          value: 'FFC Grants Cattle Housing Web'
        }),
        expect.objectContaining({
          classes: 'govuk-tag--blue',
          kind: 'tag',
          value: 'production'
        }),
        expect.objectContaining({
          kind: 'text',
          value: '1.0.0'
        }),
        expect.objectContaining({
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'RUNNING'
        }),
        expect.objectContaining({
          kind: 'text',
          value: 'RoboCop'
        }),
        expect.objectContaining({
          kind: 'date',
          value: '2023-04-11T14:40:02.242Z'
        })
      ])
    )
  })
})
