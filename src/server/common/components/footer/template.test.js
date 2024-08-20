import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Footer Component', () => {
  let $footer

  beforeEach(() => {
    $footer = renderTestComponent('footer')
  })

  test('Should render footer', () => {
    expect($footer('[data-testid="app-footer"]')).toHaveLength(1)
  })
})
