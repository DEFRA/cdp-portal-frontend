import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Button Component', () => {
  let $button
  let $buttonLoader

  beforeEach(() => {
    const $component = renderTestComponent('button', {
      text: 'Press me!',
      loader: {
        name: 'button-loader'
      }
    })

    $button = $component('[data-testid="app-button"]').first()
    $buttonLoader = $component('[data-testid="app-loader"]').first()
  })

  test('Should render with expected loader attribute', () => {
    expect($button.attr('data-loader')).toBe('button-loader')
  })

  test('Should render with expected button text', () => {
    expect($button.text().trim()).toBe('Press me!')
  })

  test('Should render button loader', () => {
    expect($buttonLoader).toHaveLength(1)
  })

  test('Should render button loader with expected js attribute', () => {
    expect($buttonLoader.attr('data-js')).toBe('button-loader')
  })
})
