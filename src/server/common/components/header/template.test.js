import { renderTestComponent } from '~/test-helpers/component-helpers.js'

describe('Header Component', () => {
  let $header

  beforeEach(() => {
    const $icon = renderTestComponent('icons/world-icon', {
      classes: 'app-icon--small app-icon--fill-blue',
      description: 'Frontend custom application urls'
    })

    $header = renderTestComponent('header', {
      heading: {
        size: 2,
        text: 'Service URls'
      },
      icon: $icon.html()
    })
  })

  test('Should render app header component', () => {
    expect($header('[data-testid="app-header"]')).toHaveLength(1)
  })

  test('Should contain expected heading', () => {
    expect($header('[data-testid="app-header"]').text().trim()).toBe(
      'Service URls'
    )
  })

  test('Should have expected icon', () => {
    expect($header('[data-testid="app-world-icon"]')).toHaveLength(1)
  })
})
