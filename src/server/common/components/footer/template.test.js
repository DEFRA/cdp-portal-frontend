import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Footer Component', () => {
  let $footer

  beforeEach(() => {
    $footer = renderTestComponent('footer')
  })

  test('Should render footer', () => {
    expect($footer('[data-testid="app-footer"]')).toHaveLength(1)
  })
})
