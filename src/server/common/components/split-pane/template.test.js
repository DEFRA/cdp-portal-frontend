import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Split Pane Component', () => {
  let $splitPane, $splitPaneNav, $splitPaneContent

  beforeEach(() => {
    const $component = renderTestComponent('split-pane', {
      params: {
        isWide: true
      },
      callBlock: [`<p>Welcome to the secrets page</p>`],
      context: {
        subNavigation: [
          {
            isActive: false,
            url: 'services/cdp-portal-frontend',
            label: { text: 'About' }
          },
          {
            isActive: true,
            url: 'services/cdp-portal-frontend/secrets',
            label: { text: 'Secrets' }
          }
        ]
      }
    })

    $splitPane = $component('[data-testid="app-split-pane"]')
    $splitPaneNav = $component('[data-testid="app-split-pane-nav"]').first()
    $splitPaneContent = $component(
      '[data-testid="app-split-pane-content"]'
    ).first()
  })

  test('Should render with expected class', () => {
    expect($splitPane.attr('class')).toEqual('app-split-pane')
  })

  test('Should render with expected nav items', () => {
    const $firstLi = $splitPaneNav.find('li').eq(0)
    const $firstAnchor = $firstLi.find('a')
    const $secondLi = $splitPaneNav.find('li').eq(1)
    const $secondAnchor = $secondLi.find('a')

    expect($firstLi.attr('class')).toEqual('app-subnav__section-item')
    expect($firstAnchor.text()).toEqual('About')
    expect($firstAnchor.attr('href')).toEqual('services/cdp-portal-frontend')

    expect($secondLi.attr('class')).toEqual(
      'app-subnav__section-item app-subnav__section-item--current'
    )
    expect($secondAnchor.text()).toEqual('Secrets')
    expect($secondAnchor.attr('href')).toEqual(
      'services/cdp-portal-frontend/secrets'
    )
  })

  test('Should render with expected content', () => {
    expect($splitPaneContent.find('section').attr('class')).toEqual(
      'app-content'
    )
    expect($splitPaneContent.find('p').text()).toEqual(
      'Welcome to the secrets page'
    )
  })
})
