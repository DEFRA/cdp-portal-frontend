import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Loader Component', () => {
  let $buttonLoader

  beforeEach(() => {
    $buttonLoader = renderTestComponent('loader', {
      name: 'button-loader'
    })('[data-testid="app-loader"]').first()
  })

  test('Should render loader', () => {
    expect($buttonLoader).toHaveLength(1)
  })
})
