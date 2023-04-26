import { transformDeploymentToEntityRow } from '~/src/app/deployments/transformers/transform-deployment-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentToEntityRow', () => {
  test('Should provide expected deployment transformation', () => {
    expect(transformDeploymentToEntityRow(deploymentsFixture.at(0))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'link',
          url: '/cdp-portal-frontend/deployments/64be9663-e19b-4dd1-b606-8fa1a5094ba5',
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
          value: 'Deployed'
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
