import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('App select with loader Component', () => {
  let $select
  let $selectLoader

  beforeEach(() => {
    const $component = renderTestComponent('select', {
      params: {
        attributes: {
          'data-testid': 'app-select'
        },
        loader: {
          name: 'app-select-loader'
        }
      }
    })

    $select = $component('[data-testid="app-select"]').first()
    $selectLoader = $component('[data-testid="app-loader"]').first()
  })

  test('Should render select', () => {
    expect($select).toHaveLength(1)
  })

  test('Should render select loader', () => {
    expect($selectLoader).toHaveLength(1)
  })

  test('Should render select loader with expected js attribute', () => {
    expect($selectLoader.attr('data-js')).toBe('app-select-loader')
  })
})
