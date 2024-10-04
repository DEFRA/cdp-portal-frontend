import {
  transformFeaturesToEntityRows,
  transformFeatureToEntityRow
} from '~/src/server/admin/features/transformers/transform-feature-to-entity-row'

describe('transformFeatureToEntityRow', () => {
  test('Should return entity row for active feature', () => {
    const feature = {
      title: 'Feature 1',
      enabled: true,
      created: '2021-01-01',
      urlPrefix: '/some-url'
    }

    const result = transformFeatureToEntityRow(feature)

    expect(result).toHaveLength(4)
    expect(result).toEqual([
      {
        kind: 'text',
        value: 'Feature 1'
      },
      {
        kind: 'text',
        value: 'Active'
      },
      {
        kind: 'date',
        value: '2021-01-01'
      },
      {
        kind: 'button',
        value: 'Deactivate',
        url: '/some-url/delete',
        classes: 'app-button--small app-button--destructive'
      }
    ])
  })

  test('Should return entity row for inactive feature', () => {
    const feature = {
      title: 'Feature 2',
      enabled: false,
      urlPrefix: '/some-url'
    }

    const result = transformFeatureToEntityRow(feature)

    expect(result).toHaveLength(4)
    expect(result).toEqual([
      {
        kind: 'text',
        value: 'Feature 2'
      },
      {
        kind: 'text',
        value: 'Not active'
      },
      {
        kind: 'text',
        value: ''
      },
      {
        kind: 'button',
        value: 'Activate',
        url: '/some-url',
        classes: 'app-button--small'
      }
    ])
  })
})

describe('transformFeaturesToEntityRows', () => {
  test('Should return entity rows for features', () => {
    const features = [
      {
        title: 'Feature 1',
        enabled: true,
        created: '2021-01-01',
        urlPrefix: '/some-url'
      },
      {
        title: 'Feature 2',
        enabled: false,
        urlPrefix: '/some-url'
      }
    ]

    const result = transformFeaturesToEntityRows(features)

    expect(result).toHaveLength(2)

    expect(result[0][0].value).toBe('Feature 1')
    expect(result[0][1].value).toBe('Active')
    expect(result[1][0].value).toBe('Feature 2')
    expect(result[1][1].value).toBe('Not active')
  })

  test('Should return empty array when no features', () => {
    const result = transformFeaturesToEntityRows(null)

    expect(result).toEqual([])
  })
})
