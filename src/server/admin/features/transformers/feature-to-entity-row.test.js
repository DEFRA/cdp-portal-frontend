import { noValue } from '~/src/server/common/constants/no-value.js'
import { featureToEntityRow } from '~/src/server/admin/features/transformers/feature-to-entity-row.js'
import { featuresFixture } from '~/src/__fixtures__/features.js'

describe('featureToEntityRow', () => {
  test('Should return correct row structure for an enabled feature', () => {
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
          value: 'Enabled'
        },
        headers: 'status'
      },
      {
        entity: {
          kind: 'date',
          value: '2025-07-10T08:10:54.596Z'
        },
        headers: 'enabled'
      },
      {
        entity: {
          kind: 'date',
          value: '2025-07-11T08:10:54.596Z'
        },
        headers: 'expires'
      },
      {
        entity: {
          classes: 'app-button--small app-button--destructive',
          kind: 'button',
          url: '/admin/features/disable-create-service/toggle',
          value: 'Disable'
        },
        headers: 'actions'
      }
    ])
  })

  test('Should return correct row structure for a disabled feature', () => {
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
          value: 'Disabled'
        },
        headers: 'status'
      },
      {
        entity: {
          kind: 'text',
          value: '- - -'
        },
        headers: 'enabled'
      },
      {
        entity: {
          kind: 'text',
          value: '- - -'
        },
        headers: 'expires'
      },
      {
        entity: {
          classes: 'app-button--small',
          kind: 'button',
          url: '/admin/features/disable-decommission/toggle',
          value: 'Enable'
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
      enabled: true,
      enabledAt: '2023-10-01T00:00:00Z',
      expiresAt: '2023-12-01T00:00:00Z'
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

  test('Should handle missing enabledAt and expiresAt gracefully', () => {
    const feature = {
      id: '101',
      name: 'Feature Without Dates',
      url: 'https://example.net',
      enabled: false,
      enabledAt: null,
      expiresAt: null
    }

    const result = featureToEntityRow(feature)

    expect(result.cells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          headers: 'enabled',
          entity: { kind: 'text', value: noValue }
        }),
        expect.objectContaining({
          headers: 'expires',
          entity: { kind: 'text', value: noValue }
        })
      ])
    )
  })
})
