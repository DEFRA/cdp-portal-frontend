import { transformDeploymentsToEntityRow } from '~/src/app/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#transformDeploymentsToEntityRow', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(transformDeploymentsToEntityRow(deploymentsFixture.at(0))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'link',
          url: '/cdp-portal-frontend/deployments/0C4B29DB-2CFD-4EDA-AB79-7E39DEB36E3E',
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
