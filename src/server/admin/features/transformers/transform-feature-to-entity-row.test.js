import {
  transformFeaturesToEntityRows,
  transformFeatureToEntityRow
} from '~/src/server/admin/features/transformers/transform-feature-to-entity-row.js'

describe('transformFeatureToEntityRow', () => {
  test('Should return entity row for active feature', () => {
    const feature = {
      title: 'Feature 1',
      enabled: true,
      created: '2021-01-01',
      urlPrefix: '/some-url'
    }

    const result = transformFeatureToEntityRow(feature)

    expect(result).toEqual({
      cells: [
        {
          entity: {
            kind: 'text',
            value: 'Feature 1'
          },
          headers: 'feature'
        },
        {
          entity: {
            kind: 'text',
            value: 'Active'
          },
          headers: 'status'
        },
        {
          entity: {
            kind: 'date',
            value: '2021-01-01'
          },
          headers: 'activated'
        },
        {
          entity: {
            classes: 'app-button--small app-button--destructive',
            kind: 'button',
            url: '/some-url/delete',
            value: 'Deactivate'
          },
          headers: 'actions'
        }
      ]
    })
  })

  test('Should return entity row for inactive feature', () => {
    const feature = {
      title: 'Feature 2',
      enabled: false,
      urlPrefix: '/some-url'
    }

    const result = transformFeatureToEntityRow(feature)

    expect(result).toEqual({
      cells: [
        {
          entity: {
            kind: 'text',
            value: 'Feature 2'
          },
          headers: 'feature'
        },
        {
          entity: {
            kind: 'text',
            value: 'Not active'
          },
          headers: 'status'
        },
        {
          entity: {
            kind: 'text',
            value: '- - -'
          },
          headers: 'activated'
        },
        {
          entity: {
            classes: 'app-button--small',
            kind: 'button',
            url: '/some-url',
            value: 'Activate'
          },
          headers: 'actions'
        }
      ]
    })
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

    expect(result).toEqual([
      {
        cells: [
          {
            entity: {
              kind: 'text',
              value: 'Feature 1'
            },
            headers: 'feature'
          },
          {
            entity: {
              kind: 'text',
              value: 'Active'
            },
            headers: 'status'
          },
          {
            entity: {
              kind: 'date',
              value: '2021-01-01'
            },
            headers: 'activated'
          },
          {
            entity: {
              classes: 'app-button--small app-button--destructive',
              kind: 'button',
              url: '/some-url/delete',
              value: 'Deactivate'
            },
            headers: 'actions'
          }
        ]
      },
      {
        cells: [
          {
            entity: {
              kind: 'text',
              value: 'Feature 2'
            },
            headers: 'feature'
          },
          {
            entity: {
              kind: 'text',
              value: 'Not active'
            },
            headers: 'status'
          },
          {
            entity: {
              kind: 'text',
              value: '- - -'
            },
            headers: 'activated'
          },
          {
            entity: {
              classes: 'app-button--small',
              kind: 'button',
              url: '/some-url',
              value: 'Activate'
            },
            headers: 'actions'
          }
        ]
      }
    ])
  })

  test('Should return empty array when no features', () => {
    const result = transformFeaturesToEntityRows(null)

    expect(result).toEqual([])
  })
})
