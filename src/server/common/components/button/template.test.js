import { renderComponent } from '~/test-helpers/component-helpers'

describe('Button Component', () => {
  let $button
  let $buttonLoader

  beforeEach(() => {
    const $component = renderComponent('button', {
      text: 'Press me!',
      loader: {
        name: 'button-loader'
      }
    })

    $button = $component('[data-testid="app-button"]').first()
    $buttonLoader = $component('[data-testid="app-loader"]').first()
  })

  test('Should render with expected loader attribute', () => {
    expect($button.attr('data-loader')).toEqual('button-loader')
  })

  test('Should render with expected button text', () => {
    expect($button.text().trim()).toEqual('Press me!')
  })

  test('Should render button loader', () => {
    expect($buttonLoader.length).toEqual(1)
  })

  test('Should render button loader with expected js attribute', () => {
    expect($buttonLoader.attr('data-js')).toEqual('button-loader')
  })
})
