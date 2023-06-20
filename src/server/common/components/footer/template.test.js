import { renderComponent } from '~/test-helpers/component-helpers'

describe('Footer Component', () => {
  let $footer

  beforeEach(() => {
    $footer = renderComponent('footer')
  })

  test('Should render footer', () => {
    expect($footer('[data-testid="app-footer"]').length).toEqual(1)
  })
})
