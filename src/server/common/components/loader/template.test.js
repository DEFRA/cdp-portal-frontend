import { renderComponent } from '~/test-helpers/component-helpers'

describe('Loader Component', () => {
  let $buttonLoader

  beforeEach(() => {
    $buttonLoader = renderComponent('loader', {
      name: 'button-loader'
    })('[data-testid="app-loader"]').first()
  })

  test('Should render loader', () => {
    expect($buttonLoader.length).toEqual(1)
  })
})
