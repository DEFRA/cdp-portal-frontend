import { featureToEntityRow } from './feature-to-entity-row.js'
import { featuresFixture } from '../../../../__fixtures__/features.js'

describe('featureToEntityRow', () => {
  test('Should return correct row structure for an active feature', () => {
    const result = featureToEntityRow(featuresFixture.at(0))

    expect(result.cells).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'Disable create service'
        },
        headers: 'feature'
      },
      {
        entity: {
          kind: 'link',
          url: '/create',
          value: '/create'
        },
        headers: 'url'
      },
      {
        entity: {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'Active'
        },
        headers: 'status'
      },
      {
        entity: {
          classes: 'app-button--small app-button--destructive',
          kind: 'button',
          url: '/admin/features/disable-create-service/toggle/false',
          value: 'Deactivate'
        },
        headers: 'actions'
      }
    ])
  })

  test('Should return correct row structure for an inactive feature', () => {
    const result = featureToEntityRow(featuresFixture.at(1))

    expect(result.cells).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'Disable decommission'
        },
        headers: 'feature'
      },
      {
        entity: {
          kind: 'link',
          url: '/admin/decommissions/start',
          value: '/admin/decommissions/start'
        },
        headers: 'url'
      },
      {
        entity: {
          classes: 'govuk-tag--grey',
          kind: 'tag',
          value: 'Inactive'
        },
        headers: 'status'
      },
      {
        entity: {
          classes: 'app-button--small',
          kind: 'button',
          url: '/admin/features/disable-decommission/toggle/true',
          value: 'Activate'
        },
        headers: 'actions'
      }
    ])
  })

  test('Should handle missing URL gracefully', () => {
    const feature = {
      id: '789',
      name: 'Feature Without URL',
      url: null,
      active: true
    }

    const result = featureToEntityRow(feature)

    expect(result.cells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          headers: 'url',
          entity: {
            kind: 'link',
            value: null,
            url: null
          }
        })
      ])
    )
  })
})
